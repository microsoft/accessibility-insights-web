// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import * as React from 'react';
import { ToolLink } from 'reports/components/report-sections/tool-link';

describe('ToolLink', () => {
    it('renders', () => {
        const renderResult = render(<ToolLink />);

        expect(renderResult.asFragment()).toMatchSnapshot();
    });
});
