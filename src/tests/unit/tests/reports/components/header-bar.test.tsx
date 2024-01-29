// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import * as React from 'react';
import { HeaderBar } from 'reports/components/header-bar';

describe('HeaderBar', () => {
    it('renders', () => {
        const headerText = 'header text';
        const renderResult = render(<HeaderBar headerText={headerText} />);
        expect(renderResult.asFragment()).toMatchSnapshot();
    });
});
