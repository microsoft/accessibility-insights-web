// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { GuidanceLinks, GuidanceLinksProps } from 'common/components/guidance-links';
import { NewTabLink } from 'common/components/new-tab-link';
import { HyperlinkDefinition } from 'common/types/hyperlink-definition';
import { shallow } from 'enzyme';
import * as React from 'react';

describe('GuidanceLinksTest', () => {
    const testLink1 = {
        text: 'text1',
        href: 'https://url1',
    } as HyperlinkDefinition;

    test('links is null', () => {
        const props: GuidanceLinksProps = {
            links: null,
            classNameForDiv: null,
            LinkComponent: NewTabLink,
        };

        const rendered = shallow(<GuidanceLinks {...props} />);
        expect(rendered.debug()).toMatchSnapshot();
    });

    test('links is empty', () => {
        const props: GuidanceLinksProps = {
            links: [],
            classNameForDiv: null,
            LinkComponent: NewTabLink,
        };

        const rendered = shallow(<GuidanceLinks {...props} />);
        expect(rendered.debug()).toMatchSnapshot();
    });

    test('link click -> event propagation stoped', () => {
        const props: GuidanceLinksProps = {
            links: [testLink1],
            classNameForDiv: 'className',
            LinkComponent: NewTabLink,
        };

        const rendered = shallow(<GuidanceLinks {...props} />);

        const event = {
            stopPropagation: jest.fn(),
        };

        rendered.find(NewTabLink).simulate('click', event);

        expect(event.stopPropagation).toHaveBeenCalledTimes(1);
    });
});
