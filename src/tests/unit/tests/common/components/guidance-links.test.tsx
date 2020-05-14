// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';

import { GuidanceLinks, GuidanceLinksProps } from '../../../../../common/components/guidance-links';
import { NewTabLink } from '../../../../../common/components/new-tab-link';
import { ElectronExternalLink } from 'electron/views/device-connect-view/components/electron-external-link';

describe('GuidanceLinksTest', () => {
    test('links is null', () => {
        const props: GuidanceLinksProps = {
            links: null,
            classNameForDiv: null,
        };

        const rendered = shallow(<GuidanceLinks {...props} />);
        expect(rendered.debug()).toMatchSnapshot();
    });

    test('links is empty', () => {
        const props: GuidanceLinksProps = {
            links: [],
            classNameForDiv: null,
        };

        const rendered = shallow(<GuidanceLinks {...props} />);
        expect(rendered.debug()).toMatchSnapshot();
    });

    test('links is not null', () => {
        const props: GuidanceLinksProps = {
            links: [
                {
                    text: 'text1',
                    href: 'https://url1',
                },
                {
                    text: 'text2',
                    href: 'https://url2',
                },
            ],
            classNameForDiv: 'className',
        };

        const rendered = shallow(<GuidanceLinks {...props} />);
        expect(rendered.debug()).toMatchSnapshot();
    });

    test('linkComponentType is defined as ElectronExternalLink', () => {
        const props: GuidanceLinksProps = {
            links: [
                {
                    text: 'text1',
                    href: 'https://url1',
                },
            ],
            LinkComponent: ElectronExternalLink,
        };

        const rendered = shallow(<GuidanceLinks {...props} />);
        expect(rendered.debug()).toMatchSnapshot();
    });

    test('link click -> event propagation stoped', () => {
        const props: GuidanceLinksProps = {
            links: [
                {
                    text: 'text1',
                    href: 'https://url1',
                },
            ],
            classNameForDiv: 'className',
        };

        const rendered = shallow(<GuidanceLinks {...props} />);

        const event = {
            stopPropagation: jest.fn(),
        };

        rendered.find(NewTabLink).simulate('click', event);

        expect(event.stopPropagation).toHaveBeenCalledTimes(1);
    });
});
