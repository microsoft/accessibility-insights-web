// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NavLinkButton } from 'DetailsView/components/nav-link-button';
import { shallow } from 'enzyme';
import { Nav } from '@fluentui/react';
import * as React from 'react';
import {
    BaseLeftNav,
    BaseLeftNavLink,
    BaseLeftNavProps,
} from '../../../../../DetailsView/components/base-left-nav';

describe('BaseLeftNav', () => {
    it('should render', () => {
        const props: BaseLeftNavProps = {
            selectedKey: 'some key',
            links: [{} as BaseLeftNavLink],
            setNavComponentRef: _ => {},
        } as BaseLeftNavProps;

        const actual = shallow(<BaseLeftNav {...props} />);
        expect(actual.getElement()).toMatchSnapshot();
        expect(actual.find(Nav).prop('linkAs')).toEqual(NavLinkButton);
    });
});
