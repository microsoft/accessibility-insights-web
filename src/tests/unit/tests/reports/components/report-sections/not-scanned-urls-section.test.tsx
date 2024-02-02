// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import * as React from 'react';
import {
    NotScannedUrlsSection,
    NotScannedUrlsSectionDeps,
} from 'reports/components/report-sections/not-scanned-urls-section';
import { SummaryScanResult, SummaryScanError } from 'reports/package/accessibilityInsightsReport';
import { CollapsibleUrlResultSection } from '../../../../../../reports/components/report-sections/collapsible-url-result-section';
import { mockReactComponents } from '../../../../mock-helpers/mock-module-helpers';

jest.mock('../../../../../../reports/components/report-sections/collapsible-url-result-section');
describe(NotScannedUrlsSection.displayName, () => {
    mockReactComponents([CollapsibleUrlResultSection]);
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
        const renderResult = render(<NotScannedUrlsSection {...props} />);

        expect(renderResult.asFragment()).toMatchSnapshot();
    });
});
