// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import * as React from 'react';
import { SummaryReportSectionProps } from 'reports/components/report-sections/summary-report-section-factory';
import { SummaryReportSummarySection } from 'reports/components/report-sections/summary-report-summary-section';
import {
    SummaryScanResults,
    SummaryScanResult,
    SummaryScanError,
} from 'reports/package/accessibilityInsightsReport';
import { UrlsSummarySection } from '../../../../../../reports/components/report-sections/urls-summary-section';
import { mockReactComponents } from '../../../../mock-helpers/mock-module-helpers';

jest.mock('../../../../../../reports/components/report-sections/urls-summary-section');
describe('SummaryReportSummarySection', () => {
    mockReactComponents([UrlsSummarySection]);
    const failed = [
        {
            url: 'https://url.com/failed1',
            numFailures: 1,
            reportLocation: 'failed report link 1',
        },
        {
            url: 'https://url.com/failed2',
            numFailures: 4,
            reportLocation: 'failed report link 2',
        },
    ];
    const passed = [{}] as SummaryScanResult[];
    const unscannable = [{}, {}, {}] as SummaryScanError[];
    const results: SummaryScanResults = {
        failed,
        passed,
        unscannable,
    };

    it('renders', () => {
        const props = {
            results,
        } as SummaryReportSectionProps;
        const renderResult = render(<SummaryReportSummarySection {...props} />);

        expect(renderResult.asFragment()).toMatchSnapshot();
    });
});
