// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import { ILinkProps } from '@fluentui/react';
import * as React from 'react';

import { NewTabLink } from '../../../../../common/components/new-tab-link';

describe('NewTabLink', () => {
    it('renders content with custom className', () => {
        const props: ILinkProps = {
            href: 'test',
            className: 'custom-class',
        };

        const renderResult = render(<NewTabLink {...props} />);

        expect(renderResult.asFragment()).toMatchSnapshot();
    });

    it('renders content without custom className', () => {
        const props: ILinkProps = {
            href: 'test',
        };

        const renderResult = render(<NewTabLink {...props} />);

        expect(renderResult.asFragment()).toMatchSnapshot();
    });

    it('handles children', () => {
        const props: ILinkProps = {
            href: 'test',
        };

        const renderResult = render(<NewTabLink {...props}>link text</NewTabLink>);

        expect(renderResult.asFragment()).toMatchSnapshot();
    });
});
