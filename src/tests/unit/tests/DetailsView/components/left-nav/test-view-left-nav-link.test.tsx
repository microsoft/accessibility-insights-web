// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import * as React from 'react';

import {
    BaseLeftNavLink,
    BaseLeftNavLinkProps,
} from '../../../../../../DetailsView/components/base-left-nav';
import { TestViewLeftNavLink } from '../../../../../../DetailsView/components/left-nav/test-view-left-nav-link';

describe('TestViewLeftNavLink', () => {
    it('renders', () => {
        const props: BaseLeftNavLinkProps = {
            link: {
                name: 'test-props-link-name',
            } as BaseLeftNavLink,
            renderIcon: () => <i>test-props-renderIcon</i>,
        };

        const renderResult = render(<TestViewLeftNavLink {...props} />);
        expect(renderResult.asFragment()).toMatchSnapshot();
    });
});
