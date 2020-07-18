// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    onBaseLeftNavItemClick,
    onBaseLeftNavItemRender,
} from 'DetailsView/components/base-left-nav';
import { NavLinkButton, NavLinkButtonProps } from 'DetailsView/components/nav-link-button';
import { shallow } from 'enzyme';
import * as React from 'react';
import { Mock } from 'typemoq';

describe('NavLinkButton', () => {
    test('renders', () => {
        const onClickNavLinkMock = Mock.ofType<onBaseLeftNavItemClick>();
        const onRenderNavLink = Mock.ofType<onBaseLeftNavItemRender>();
        const props: NavLinkButtonProps = {
            link: {
                isExpanded: true,
                title: 'some title',
                onClickNavLink: onClickNavLinkMock.object,
                onRenderNavLink: onRenderNavLink.object,
            },
            className: 'some class name',
        } as NavLinkButtonProps;

        const testSubject = shallow(<NavLinkButton {...props} />);
        expect(testSubject.getElement()).toMatchSnapshot();
    });
});
