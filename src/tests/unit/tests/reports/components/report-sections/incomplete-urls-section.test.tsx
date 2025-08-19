// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import * as React from 'react';
import {
    IncompleteUrlsSection,
    IncompleteUrlsSectionDeps,
} from 'reports/components/report-sections/incomplete-urls-section';
import { SummaryScanResult, SummaryScanError } from 'reports/package/accessibilityInsightsReport';
import { CollapsibleUrlResultSection } from '../../../../../../reports/components/report-sections/collapsible-url-result-section';
import {
    expectMockedComponentPropsToMatchSnapshots,
    mockReactComponents,
} from '../../../../mock-helpers/mock-module-helpers';

jest.mock('../../../../../../reports/components/report-sections/collapsible-url-result-section');
describe(IncompleteUrlsSection.displayName, () => {
    mockReactComponents([CollapsibleUrlResultSection]);
    const failed = [{}] as SummaryScanResult[];
    const passed = [{}, {}] as SummaryScanResult[];
    const unscannable = [{}, {}, {}] as SummaryScanError[];
    const incomplete = [{}] as SummaryScanResult[];
    it('renders', () => {
        const props = {
            deps: {} as IncompleteUrlsSectionDeps,
            results: {
                failed,
                passed,
                unscannable,
                incomplete,
            },
        };
        const renderResult = render(<IncompleteUrlsSection {...props} />);

        expect(renderResult.asFragment()).toMatchSnapshot();
        expectMockedComponentPropsToMatchSnapshots([CollapsibleUrlResultSection]);
    });
});
