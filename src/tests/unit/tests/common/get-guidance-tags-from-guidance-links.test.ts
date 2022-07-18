// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { GetGuidanceTagsFromGuidanceLinks } from 'common/get-guidance-tags-from-guidance-links';
import { GuidanceLink } from 'common/types/store-data/guidance-links';

describe('GetGuidanceTagsFromGuidanceLinks', () => {
    it.each([null, [], [undefined]])('handles invalid arg %p', (links: GuidanceLink[]) => {
        expect(GetGuidanceTagsFromGuidanceLinks(links)).toEqual([]);
    });

    const testLink1: GuidanceLink = {
        href: null,
        text: null,
        tags: [{ id: 'guidanceLinks-tags-id-1', displayText: 'guidanceLinks-tags-displayText-1' }],
    };
    const testLink2: GuidanceLink = {
        href: null,
        text: null,
        tags: [{ id: 'guidanceLinks-tags-id-2', displayText: 'guidanceLinks-tags-displayText-2' }],
    };

    it('handles a valid list with 1 link', () => {
        expect(GetGuidanceTagsFromGuidanceLinks([testLink1])).toMatchSnapshot();
    });

    it('handles a valid list with 2 links', () => {
        expect(GetGuidanceTagsFromGuidanceLinks([testLink1, testLink2])).toMatchSnapshot();
    });
});
