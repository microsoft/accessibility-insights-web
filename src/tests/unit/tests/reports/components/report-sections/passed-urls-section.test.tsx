// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import {
    PassedUrlsSectionDeps,
    PassedUrlsSection,
} from 'reports/components/report-sections/passed-urls-section';
import { SummaryScanError, SummaryScanResult } from 'reports/package/accessibilityInsightsReport';

describe(PassedUrlsSection, () => {
    const failed = [{}] as SummaryScanResult[];
    const passed = [{}, {}] as SummaryScanResult[];
    const unscannable = [{}, {}, {}] as SummaryScanError[];

    it('renders', () => {
        const props = {
            deps: {} as PassedUrlsSectionDeps,
            results: {
                failed,
                passed,
                unscannable,
            },
        };
        const wrapper = shallow(<PassedUrlsSection {...props} />);

        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
