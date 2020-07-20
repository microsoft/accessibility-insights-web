// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    onBaseLeftNavItemClick,
    onBaseLeftNavItemRender,
} from 'DetailsView/components/base-left-nav';
import { NavLinkButton, NavLinkButtonProps } from 'DetailsView/components/nav-link-button';
import { shallow } from 'enzyme';
import * as React from 'react';
import { IMock, Mock } from 'typemoq';

describe('NavLinkButton', () => {
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
        const testSubject = shallow(<NavLinkButton {...props} />);
        expect(testSubject.getElement()).toMatchSnapshot();
    });

    test('renders with href set', () => {
        props.link.forceAnchor = true;
        const testSubject = shallow(<NavLinkButton {...props} />);
        expect(testSubject.getElement()).toMatchSnapshot();
    });

    test('renders with using name instead of title', () => {
        props.link.name = 'some name';
        const testSubject = shallow(<NavLinkButton {...props} />);
        expect(testSubject.getElement()).toMatchSnapshot();
    });
});
