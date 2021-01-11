// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import {
    FailedUrlsSection,
    FailedUrlsSectionDeps,
} from 'reports/components/report-sections/failed-urls-section';
import { SummaryScanResult, SummaryScanError } from 'reports/package/accessibilityInsightsReport';

describe(FailedUrlsSection, () => {
    const failed = [{}] as SummaryScanResult[];
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
