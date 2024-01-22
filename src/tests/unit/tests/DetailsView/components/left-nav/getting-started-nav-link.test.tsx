// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { render } from '@testing-library/react';
import { GettingStartedNavLink } from 'DetailsView/components/left-nav/getting-started-nav-link';
import * as React from 'react';

describe('GettingStartedNavLink', () => {
    test('renders', () => {
        const renderResult = render(<GettingStartedNavLink />);
        expect(renderResult.asFragment()).toMatchSnapshot();
    });
});
