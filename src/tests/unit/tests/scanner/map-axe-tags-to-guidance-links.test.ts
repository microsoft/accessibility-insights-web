// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as axe from 'axe-core';
import { link } from 'content/link';
import { flatMap } from 'lodash';
import { BestPractice, mapAxeTagsToGuidanceLinks } from 'scanner/map-axe-tags-to-guidance-links';

describe('mapAxeTagsToGuidanceLinks', () => {
    const defaultIncludedRuleId = 'color-contrast';
    it('should map best-practice to the BestPractice link', () => {
        expect(mapAxeTagsToGuidanceLinks(defaultIncludedRuleId, ['best-practice'])).toEqual([
            BestPractice,
        ]);
    });

    it.each([null, undefined])('should map %p tags to no links', tags => {
        expect(mapAxeTagsToGuidanceLinks(defaultIncludedRuleId, tags)).toEqual([]);
    });

    const wcagAAAtags = ['wcag146', 'wcag223', 'wcag224', 'wcag248', 'wcag249', 'wcag325'];

    const irrelevantAxeCoreTags = [
        // axe-core specific, not required for our purposes
        'cat.aria',
        'experimental',
        // refers to WCAG standard levels; we prefer to use guidance for specific wcag sections
        'wcag2a',
        'wcag2aa',
        'wcag21a',
        'wcag21aa',
        // this WCAG section doesn't exist as of writing; if a future axe update picks up a new
        // WCAG entry before we do, we want to omit it until we write new guidance for it
        'wcag112',
        // we intentionally omit AAA and WCAG 2.2-only success criteria from guidance links; we
        // don't want users to get confused about whether our tool supports these assessments
        ...wcagAAAtags,
    ];
    it.each(irrelevantAxeCoreTags)(
        'should omit entries for irrelevant axe-core tag %s',
        irrelevantTag => {
            expect(mapAxeTagsToGuidanceLinks(defaultIncludedRuleId, [irrelevantTag])).toEqual([]);
        },
    );

    it('should omit entries for completely unrecognized tags', () => {
        expect(mapAxeTagsToGuidanceLinks(defaultIncludedRuleId, ['bogus'])).toEqual([]);
    });

    it.each`
        tag           | expectedLink
        ${'wcag111'}  | ${link.WCAG_1_1_1}
        ${'wcag121'}  | ${link.WCAG_1_2_1}
        ${'wcag1410'} | ${link.WCAG_1_4_10}
    `('should map known wcag tag $tag to expected link', ({ tag, expectedLink }) => {
        expect(mapAxeTagsToGuidanceLinks(defaultIncludedRuleId, [tag])).toEqual([expectedLink]);
    });

    it('should handle multiple inputs in the list (omitting unrecognized cases)', () => {
        expect(
            mapAxeTagsToGuidanceLinks(defaultIncludedRuleId, [
                'best-practice',
                'wcag111',
                'should-be-omitted',
            ]),
        ).toEqual([BestPractice, link.WCAG_1_1_1]);
    });

    it('should sort the output', () => {
        expect(
            mapAxeTagsToGuidanceLinks(defaultIncludedRuleId, [
                'wcag111',
                'wcag1411',
                'best-practice',
            ]),
        ).toEqual([BestPractice, link.WCAG_1_1_1, link.WCAG_1_4_11]);
    });

    it('should add additional links for special case ruleIds', () => {
        const specialCaseRuleId = 'aria-allowed-role';
        expect(mapAxeTagsToGuidanceLinks(specialCaseRuleId, ['best-practice'])).toEqual([
            BestPractice,
            link.WCAG_1_3_1,
            link.WCAG_4_1_2,
        ]);
    });

    const allAxeTags = new Set(flatMap(axe.getRules(), rule => rule.tags));
    const axeWcagTags = [...allAxeTags.values()].filter(tag => /^wcag\d+$/.test(tag)).sort();
    const axeWcag21NonAAATags = axeWcagTags.filter(tag => !wcagAAAtags.includes(tag));

    it.each(axeWcag21NonAAATags)(
        `should have a mapping for wcag A/AA tag "%s" used by axe`,
        axeWcagTag => {
            expect(mapAxeTagsToGuidanceLinks(defaultIncludedRuleId, [axeWcagTag])).toHaveLength(1);
        },
    );
});
