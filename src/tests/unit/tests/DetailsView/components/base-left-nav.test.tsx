// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Nav } from '@fluentui/react';
import { render } from '@testing-library/react';
import { NavLinkButton } from 'DetailsView/components/nav-link-button';
import * as React from 'react';
import {
    getMockComponentClassPropsForCall,
    mockReactComponents,
} from 'tests/unit/mock-helpers/mock-module-helpers';
import {
    BaseLeftNav,
    BaseLeftNavLink,
    BaseLeftNavProps,
} from '../../../../../DetailsView/components/base-left-nav';

jest.mock('@fluentui/react');

describe('BaseLeftNav', () => {
    mockReactComponents([Nav]);

    it('should render', () => {
        const props: BaseLeftNavProps = {
            selectedKey: 'some key',
            links: [{} as BaseLeftNavLink],
            setNavComponentRef: _ => {},
        } as BaseLeftNavProps;

        const actual = render(<BaseLeftNav {...props} />);
        expect(actual.asFragment()).toMatchSnapshot();
        const hasNav = getMockComponentClassPropsForCall(Nav);
        expect(hasNav.linkAs).toEqual(NavLinkButton);
    });
});
