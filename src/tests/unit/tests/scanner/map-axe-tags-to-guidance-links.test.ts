// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as Axe from 'axe-core';
import { link } from 'content/link';
import { flatMap } from 'lodash';
import { BestPractice, mapAxeTagsToGuidanceLinks } from 'scanner/map-axe-tags-to-guidance-links';

describe('mapAxeTagsToGuidanceLinks', () => {
    it('should map best-practice to the BestPractice link', () => {
        expect(mapAxeTagsToGuidanceLinks(['best-practice'])).toEqual([BestPractice]);
    });

    it.each([null, undefined])('should map %p tags to no links', tags => {
        expect(mapAxeTagsToGuidanceLinks(tags)).toEqual([]);
    });

    const irrelevantAxeCoreTags = ['cat.aria', 'wcag2a', 'wcag21aa', 'experimental'];
    it.each(irrelevantAxeCoreTags)(
        'should omit entries for irrelevant axe-core tag %s',
        irrelevantTag => {
            expect(mapAxeTagsToGuidanceLinks([irrelevantTag])).toEqual([]);
        },
    );

    it('should omit entries for completely unrecognized tags', () => {
        expect(mapAxeTagsToGuidanceLinks(['bogus'])).toEqual([]);
    });

    it.each`
        tag           | expectedLink
        ${'wcag111'}  | ${link.WCAG_1_1_1}
        ${'wcag121'}  | ${link.WCAG_1_2_1}
        ${'wcag1410'} | ${link.WCAG_1_4_10}
    `('should map known wcag tag $tag to expected link', ({ tag, expectedLink }) => {
        expect(mapAxeTagsToGuidanceLinks([tag])).toEqual([expectedLink]);
    });

    it('should handle multiple inputs in the list (omitting unrecognized cases)', () => {
        expect(
            mapAxeTagsToGuidanceLinks(['best-practice', 'wcag111', 'should-be-omitted']),
        ).toEqual([BestPractice, link.WCAG_1_1_1]);
    });

    const axe = Axe as any;
    const allAxeTags = new Set(flatMap(axe.getRules(), rule => rule.tags));
    const allAxeWcagTags = [...allAxeTags.values()].filter(tag => /^wcag\d+$/.test(tag)).sort();

    it.each(allAxeWcagTags)(`should have a mapping for wcag tag "%s" used by axe`, axeWcagTag => {
        expect(mapAxeTagsToGuidanceLinks([axeWcagTag])).toHaveLength(1);
    });
});
