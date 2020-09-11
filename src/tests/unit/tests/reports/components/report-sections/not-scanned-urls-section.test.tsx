// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import { SummaryScanResult, SummaryScanError } from 'reports/package/accessibilityInsightsReport';
import { shallow } from 'enzyme';
import {
    NotScannedUrlsSection,
    NotScannedUrlsSectionDeps,
} from 'reports/components/report-sections/not-scanned-urls-section';

describe(NotScannedUrlsSection, () => {
    const failed = [{}] as SummaryScanResult[];
    const passed = [{}, {}] as SummaryScanResult[];
    const unscannable = [{}, {}, {}] as SummaryScanError[];

    it('renders', () => {
        const props = {
            deps: {} as NotScannedUrlsSectionDeps,
            results: {
                failed,
                passed,
                unscannable,
            },
        };
        const wrapper = shallow(<NotScannedUrlsSection {...props} />);

        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
