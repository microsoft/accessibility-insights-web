// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import {
    SummaryScanResults,
    SummaryScanResult,
    SummaryScanError,
} from 'reports/package/accessibilityInsightsReport';
import { SummaryReportSummarySection } from 'reports/components/report-sections/summary-report-summary-section';
import { SummaryReportSectionProps } from 'reports/components/report-sections/summary-report-section-factory';

describe('SummaryReportSummarySection', () => {
    const violations = [
        {
            url: 'https://url.com/failed1',
            numFailures: 1,
            reportLocation: 'failed report link 1',
        },
        {
            url: 'https://url.com/failed2',
            numFailures: 2,
            reportLocation: 'failed report link 2',
        },
    ];
    const passes = [{}, {}] as SummaryScanResult[];
    const unscannable = [{}, {}, {}] as SummaryScanError[];
    const scenarios: [string, SummaryScanResults][] = [
        [
            'failure only',
            {
                failed: violations,
                passed: [],
                unscannable: [],
            },
        ],
        [
            'unscannable only',
            {
                failed: [],
                passed: [],
                unscannable: unscannable,
            },
        ],
        [
            'passes only',
            {
                failed: [],
                passed: passes,
                unscannable: [],
            },
        ],
        [
            'failures + unscannable only',
            {
                failed: violations,
                passed: [],
                unscannable: unscannable,
            },
        ],
        [
            'failures + passes only',
            {
                failed: violations,
                passed: passes,
                unscannable: [],
            },
        ],
        [
            'unscannable + passes only',
            {
                failed: [],
                passed: passes,
                unscannable: unscannable,
            },
        ],
        [
            'failures + unscannable + passes',
            {
                failed: violations,
                passed: passes,
                unscannable: unscannable,
            },
        ],
    ];

    it.each(scenarios)('BaseSummarySection: %s', (_, results) => {
        const props = {
            results,
        } as SummaryReportSectionProps;
        const wrapper = shallow(<SummaryReportSummarySection {...props} />);

        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
