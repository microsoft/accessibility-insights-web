// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';

import { LeftNavLinkProps, NavLinkForLeftNav } from '../../../../../DetailsView/components/details-view-left-nav';
import { TestViewLeftNavLink } from '../../../../../DetailsView/components/left-nav/test-view-left-nav-link';

describe('TestViewLeftNavLink', () => {
    it('renders', () => {
        const props: LeftNavLinkProps = {
            link: {
                name: 'test-props-link-name',
            } as NavLinkForLeftNav,
            renderIcon: () => <i>test-props-renderIcon</i>,
        };

        const wrapper = shallow(<TestViewLeftNavLink {...props} />);

        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
