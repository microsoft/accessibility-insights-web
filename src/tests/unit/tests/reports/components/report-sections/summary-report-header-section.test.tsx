// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import * as React from 'react';
import { SummaryReportHeaderSection } from 'reports/components/report-sections/summary-report-header-section';
import { HeaderBar } from '../../../../../../reports/components/header-bar';
import { mockReactComponents } from '../../../../mock-helpers/mock-module-helpers';

jest.mock('../../../../../../reports/components/header-bar');
describe('SummaryReportHeaderSection', () => {
    mockReactComponents([HeaderBar]);
    it('renders', () => {
        const renderResult = render(<SummaryReportHeaderSection />);
        expect(renderResult.asFragment()).toMatchSnapshot();
    });
});
