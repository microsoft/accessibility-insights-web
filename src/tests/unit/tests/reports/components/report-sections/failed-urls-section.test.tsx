// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import * as React from 'react';
import { CollapsibleUrlResultSection } from 'reports/components/report-sections/collapsible-url-result-section';
import {
    FailedUrlsSection,
    FailedUrlsSectionDeps,
} from 'reports/components/report-sections/failed-urls-section';
import { SummaryScanResult, SummaryScanError } from 'reports/package/accessibilityInsightsReport';
import {
    expectMockedComponentPropsToMatchSnapshots,
    mockReactComponents,
} from 'tests/unit/mock-helpers/mock-module-helpers';

jest.mock('reports/components/report-sections/collapsible-url-result-section');

describe(FailedUrlsSection.displayName, () => {
    mockReactComponents([CollapsibleUrlResultSection]);
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
        const wrapper = render(<FailedUrlsSection {...props} />);

        expect(wrapper.asFragment()).toMatchSnapshot();
        expectMockedComponentPropsToMatchSnapshots([CollapsibleUrlResultSection]);
    });
});
