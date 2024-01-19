// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import * as React from 'react';
import { ExternalLink } from '../../../../../common/components/external-link';
import {
    HelpLinks,
    HelpLinksDeps,
    HelpLinksProps,
} from '../../../../../DetailsView/components/help-links';
import { mockReactComponents } from '../../../mock-helpers/mock-module-helpers';
jest.mock('../../../../../common/components/external-link');

describe('HelpLinks', () => {
    mockReactComponents([ExternalLink]);
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

        const renderResult = render(<HelpLinks {...props} />);
        expect(renderResult.asFragment()).toMatchSnapshot();
    });
});
