// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';

import {
    BaseLeftNavLink,
    BaseLeftNavLinkProps,
} from '../../../../../../DetailsView/components/base-left-nav';
import { OverviewLeftNavLink } from '../../../../../../DetailsView/components/left-nav/overview-left-nav-link';

describe('OverviewLeftNavLink', () => {
    it('renders', () => {
        const props: BaseLeftNavLinkProps = {
            link: {
                name: 'test-props-link-name',
                percentComplete: 42,
            } as BaseLeftNavLink,
            renderIcon: undefined,
        };

        const wrapper = shallow(<OverviewLeftNavLink {...props} />);

        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
