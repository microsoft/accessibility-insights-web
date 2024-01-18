// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Icon } from '@fluentui/react';
import { render } from '@testing-library/react';
import * as React from 'react';

import {
    BaseLeftNavLink,
    BaseLeftNavLinkProps,
} from '../../../../../../DetailsView/components/base-left-nav';
import { OverviewLeftNavLink } from '../../../../../../DetailsView/components/left-nav/overview-left-nav-link';
import { mockReactComponents } from '../../../../mock-helpers/mock-module-helpers';

jest.mock('@fluentui/react', () => ({
    Icon: jest.fn(),
}));
describe('OverviewLeftNavLink', () => {
    mockReactComponents([Icon]);
    it('renders', () => {
        const props: BaseLeftNavLinkProps = {
            link: {
                name: 'test-props-link-name',
                percentComplete: 42,
            } as BaseLeftNavLink,
            renderIcon: undefined,
        };

        const renderResult = render(<OverviewLeftNavLink {...props} />);

        expect(renderResult.asFragment()).toMatchSnapshot();
    });
});
