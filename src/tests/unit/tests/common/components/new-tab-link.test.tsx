// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Link } from '@fluentui/react-components';
import { render } from '@testing-library/react';
import * as React from 'react';
import { NewTabLink, NewTabLinkProps } from '../../../../../common/components/new-tab-link';
import { mockReactComponents } from '../../../mock-helpers/mock-module-helpers';
jest.mock('@fluentui/react-components');

describe('NewTabLink', () => {
    mockReactComponents([Link]);
    it('renders content with custom className', () => {
        const props: NewTabLinkProps = {
            href: 'test',
            className: 'custom-class',
        };

        const renderResult = render(<NewTabLink {...props} />);
        expect(renderResult.asFragment()).toMatchSnapshot();
    });

    it('renders content without custom className', () => {
        const props: NewTabLinkProps = {
            href: 'test',
        };

        const renderResult = render(<NewTabLink {...props} />);
        expect(renderResult.asFragment()).toMatchSnapshot();
    });

    it('handles children', () => {
        const props: NewTabLinkProps = {
            href: 'test',
        };

        const renderResult = render(<NewTabLink {...props}>link text</NewTabLink>);
        expect(renderResult.asFragment()).toMatchSnapshot();
    });
});
