// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import * as React from 'react';
import { SummaryReportHead } from 'reports/components/summary-report-head';

describe('SummaryReportHead', () => {
    it('renders', () => {
        const renderResult = render(<SummaryReportHead />);
        expect(renderResult.asFragment()).toMatchSnapshot();
    });
});
