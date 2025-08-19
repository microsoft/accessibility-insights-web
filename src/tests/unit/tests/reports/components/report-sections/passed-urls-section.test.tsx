// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import * as React from 'react';
import {
    PassedUrlsSectionDeps,
    PassedUrlsSection,
} from 'reports/components/report-sections/passed-urls-section';
import { SummaryScanError, SummaryScanResult } from 'reports/package/accessibilityInsightsReport';
import { CollapsibleUrlResultSection } from '../../../../../../reports/components/report-sections/collapsible-url-result-section';
import {
    expectMockedComponentPropsToMatchSnapshots,
    mockReactComponents,
} from '../../../../mock-helpers/mock-module-helpers';

jest.mock('../../../../../../reports/components/report-sections/collapsible-url-result-section');
describe(PassedUrlsSection.displayName, () => {
    mockReactComponents([CollapsibleUrlResultSection]);
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
        const renderResult = render(<PassedUrlsSection {...props} />);

        expect(renderResult.asFragment()).toMatchSnapshot();
        expectMockedComponentPropsToMatchSnapshots([CollapsibleUrlResultSection]);
    });
});
