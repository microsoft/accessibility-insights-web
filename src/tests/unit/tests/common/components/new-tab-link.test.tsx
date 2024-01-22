// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ILinkProps, Link } from '@fluentui/react';
import { render } from '@testing-library/react';
import * as React from 'react';
import { NewTabLink } from '../../../../../common/components/new-tab-link';
import { mockReactComponents } from '../../../mock-helpers/mock-module-helpers';
jest.mock('@fluentui/react');

describe('NewTabLink', () => {
    mockReactComponents([Link]);
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
        //const renderResult = getMockComponentClassPropsForCall(NewTabLink);
        expect(renderResult.asFragment()).toMatchSnapshot();
    });
});
