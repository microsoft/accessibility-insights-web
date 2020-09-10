// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import {
    FailedUrlsSection,
    FailedUrlsSectionDeps,
} from 'reports/components/report-sections/failed-urls-section';
import { SummaryScanResult, SummaryScanError } from 'reports/package/accessibilityInsightsReport';
import { shallow } from 'enzyme';

describe(FailedUrlsSection, () => {
    const failed = [
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
    const passed = [{}, {}] as SummaryScanResult[];
    const unscannable = [{}, {}, {}] as SummaryScanError[];

    it('renders', () => {
        const props = {
            deps: {} as FailedUrlsSectionDeps,
            results: {
                failed,
                passed,
                unscannable,
            },
        };
        const wrapper = shallow(<FailedUrlsSection {...props} />);

        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
