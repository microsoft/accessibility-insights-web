// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import * as React from 'react';
import {
    UrlsSummarySection,
    UrlsSummarySectionProps,
} from 'reports/components/report-sections/urls-summary-section';
import { OutcomeChip } from '../../../../../../reports/components/outcome-chip';
import { OutcomeSummaryBar } from '../../../../../../reports/components/outcome-summary-bar';
import {
    expectMockedComponentPropsToMatchSnapshots,
    mockReactComponents,
} from '../../../../mock-helpers/mock-module-helpers';
jest.mock('../../../../../../reports/components/outcome-summary-bar');
jest.mock('../../../../../../reports/components/outcome-chip');

describe(UrlsSummarySection.displayName, () => {
    mockReactComponents([OutcomeSummaryBar, OutcomeChip]);
    const props: UrlsSummarySectionProps = {
        passedUrlsCount: 1,
        failedUrlsCount: 2,
        notScannedUrlsCount: 3,
        failureInstancesCount: 10,
    };

    it('renders', () => {
        const renderResult = render(<UrlsSummarySection {...props} />);

        expect(renderResult.asFragment()).toMatchSnapshot();
        expectMockedComponentPropsToMatchSnapshots([OutcomeSummaryBar, OutcomeChip]);
    });
});
