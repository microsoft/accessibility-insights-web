// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';

import {
    HelpLinks,
    HelpLinksDeps,
    HelpLinksProps,
} from '../../../../../DetailsView/components/help-links';

describe('HelpLinks', () => {
    const deps = {} as HelpLinksDeps;

    test('linkInformation is shown properly', () => {
        const props: HelpLinksProps = {
            linkInformation: [
                {
                    href: 'https://www.test1.com',
                    text: 'test1',
                },
                {
                    href: 'https://www.test2.com',
                    text: 'test2',
                },
                {
                    href: 'https://www.test3.com',
                    text: 'test3',
                },
            ],
            deps,
        };

        const helpLinkSection = shallow(<HelpLinks {...props} />);
        expect(helpLinkSection.getElement()).toMatchSnapshot();
    });
});
