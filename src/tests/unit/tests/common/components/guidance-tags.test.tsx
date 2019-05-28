// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';

import { GuidanceTags, guidanceTagsFromGuidanceLinks, GuidanceTagsProps } from '../../../../../common/components/guidance-tags';
import { GuidanceTag } from '../../../../../content/guidance-tags';
import { HyperlinkDefinition } from '../../../../../views/content/content-page';

describe('GuidanceTags', () => {
    test.each([null, []])('tags is: %o', (tags: GuidanceTag[]) => {
        const props: GuidanceTagsProps = {
            deps: null,
            tags: tags,
        };
        const testSubject = shallow(<GuidanceTags {...props} />);
        expect(testSubject.getElement()).toMatchSnapshot();
    });

    test('renders tags', () => {
        const props: GuidanceTagsProps = {
            deps: null,
            tags: [
                {
                    id: 'some-tag-id',
                    displayText: 'some display text',
                },
                {
                    id: 'some-other-id',
                    displayText: 'some other text',
                },
            ],
        };

        const testSubject = shallow(<GuidanceTags {...props} />);
        expect(testSubject.getElement()).toMatchSnapshot();
    });
});

describe('guidanceTagsFromGuidanceLinks', () => {
    it.each([null, [], [undefined]])('handles invalid arg %o', (links: HyperlinkDefinition[]) => {
        expect(guidanceTagsFromGuidanceLinks(links)).toEqual([]);
    });

    const testLink1: HyperlinkDefinition = {
        href: null,
        text: null,
        tags: [{ id: 'guidanceLinks-tags-id-1', displayText: 'guidanceLinks-tags-displayText-1' }],
    };
    const testLink2: HyperlinkDefinition = {
        href: null,
        text: null,
        tags: [{ id: 'guidanceLinks-tags-id-2', displayText: 'guidanceLinks-tags-displayText-2' }],
    };

    it('handles a valid list with 1 link', () => {
        expect(guidanceTagsFromGuidanceLinks([testLink1])).toMatchSnapshot();
    });

    it('handles a valid list with 2 links', () => {
        expect(guidanceTagsFromGuidanceLinks([testLink1, testLink2])).toMatchSnapshot();
    });
});
