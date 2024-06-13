// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Link } from '@fluentui/react-components';
import { render } from '@testing-library/react';
import {
    onBaseLeftNavItemClick,
    onBaseLeftNavItemRender,
} from 'DetailsView/components/base-left-nav';
import { NavLinkButton, NavLinkButtonProps } from 'DetailsView/components/nav-link-button';
import * as React from 'react';
import { mockReactComponents } from 'tests/unit/mock-helpers/mock-module-helpers';
import { IMock, Mock } from 'typemoq';

jest.mock('@fluentui/react-components');
describe('NavLinkButton', () => {
    mockReactComponents([Link]);
    let onClickNavLinkMock: IMock<onBaseLeftNavItemClick>;
    let onRenderNavLinkMock: IMock<onBaseLeftNavItemRender>;
    let props: NavLinkButtonProps;
    beforeEach(() => {
        onClickNavLinkMock = Mock.ofType<onBaseLeftNavItemClick>();
        onRenderNavLinkMock = Mock.ofType<onBaseLeftNavItemRender>();
        props = {
            link: {
                isExpanded: true,
                title: 'some title',
                onClickNavLink: onClickNavLinkMock.object,
                onRenderNavLink: onRenderNavLinkMock.object,
            },
            className: 'some class name',
        } as NavLinkButtonProps;
    });

    test('renders as button element', () => {
        const renderResult = render(<NavLinkButton {...props} />);
        expect(renderResult.asFragment()).toMatchSnapshot();
    });

    test('renders with href set', () => {
        props.link.forceAnchor = true;
        const renderResult = render(<NavLinkButton {...props} />);
        expect(renderResult.asFragment()).toMatchSnapshot();
    });

    test('renders with using name instead of title', () => {
        props.link.name = 'some name';
        const renderResult = render(<NavLinkButton {...props} />);
        expect(renderResult.asFragment()).toMatchSnapshot();
    });

    test('renders with the proper aria-label', () => {
        props['aria-current'] = 'page';
        const renderResult = render(<NavLinkButton {...props} />);
        expect(renderResult.asFragment()).toMatchSnapshot();
    });
});
