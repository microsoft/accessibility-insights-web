// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import { GuidanceTags, GuidanceTagsProps } from 'common/components/guidance-tags';
import { GetGuidanceTagsFromGuidanceLinks } from 'common/get-guidance-tags-from-guidance-links';
import { GuidanceLink } from 'common/types/store-data/guidance-links';
import * as React from 'react';
import { IMock, Mock } from 'typemoq';

describe('GuidanceTags', () => {
    let getGuidanceTagsFromGuidanceLinksMock: IMock<GetGuidanceTagsFromGuidanceLinks>;

    beforeEach(() => {
        getGuidanceTagsFromGuidanceLinksMock = Mock.ofType(null);
    });

    test.each([null, []])('tags is: %p', (tags?: GuidanceLink[]) => {
        const props: GuidanceTagsProps = {
            deps: {
                getGuidanceTagsFromGuidanceLinks: getGuidanceTagsFromGuidanceLinksMock.object,
            },
            links: tags,
        };
        const renderResult = render(<GuidanceTags {...props} />);
        expect(renderResult.asFragment()).toMatchSnapshot();
    });

    test('renders tags', () => {
        const sampleTags = [
            {
                id: 'some-tag-id',
                displayText: 'some display text',
            },
            {
                id: 'some-other-id',
                displayText: 'some other text',
            },
        ];
        const sampleLinks = [
            {
                href: null,
                text: null,
                tags: sampleTags,
            },
            {
                href: null,
                text: null,
                tags: [],
            },
        ];
        const props: GuidanceTagsProps = {
            deps: {
                getGuidanceTagsFromGuidanceLinks: getGuidanceTagsFromGuidanceLinksMock.object,
            },
            links: sampleLinks,
        };

        getGuidanceTagsFromGuidanceLinksMock
            .setup(mock => mock(sampleLinks))
            .returns(() => sampleTags);

        const renderResult = render(<GuidanceTags {...props} />);
        expect(renderResult.asFragment()).toMatchSnapshot();
    });
});
