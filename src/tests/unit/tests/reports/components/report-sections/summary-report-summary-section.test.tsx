// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import { SummaryReportSectionProps } from 'reports/components/report-sections/summary-report-section-factory';
import { SummaryReportSummarySection } from 'reports/components/report-sections/summary-report-summary-section';
import {
    SummaryScanResults,
    SummaryScanResult,
    SummaryScanError,
} from 'reports/package/accessibilityInsightsReport';

describe('SummaryReportSummarySection', () => {
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
        const wrapper = shallow(<SummaryReportSummarySection {...props} />);

        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
