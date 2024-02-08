// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import * as React from 'react';
import { UrlScanResultsTable } from 'reports/components/report-sections/url-scan-results-table';
import { SummaryResultsTable } from '../../../../../../reports/components/report-sections/summary-results-table';
import { NewTabLink } from '../../../../../../common/components/new-tab-link';
import {
    expectMockedComponentPropsToMatchSnapshots,
    mockReactComponents,
} from '../../../../mock-helpers/mock-module-helpers';
jest.mock('../../../../../../reports/components/report-sections/summary-results-table');
jest.mock('../../../../../../common/components/new-tab-link');

describe(UrlScanResultsTable.displayName, () => {
    mockReactComponents([SummaryResultsTable, NewTabLink]);
    it('renders', () => {
        const results = [
            {
                url: 'https://url.com/1',
                reportLocation: 'report location 1',
                numFailures: 1,
            },
            {
                url: 'https://url.com/2',
                reportLocation: 'report location 2',
                numFailures: 2,
            },
            {
                url: 'https://url.com/3',
                reportLocation: 'report location 3',
                numFailures: 3,
            },
        ];

        const renderResult = render(<UrlScanResultsTable results={results} id="table-id" />);

        expect(renderResult.asFragment()).toMatchSnapshot();
        expectMockedComponentPropsToMatchSnapshots([SummaryResultsTable, NewTabLink]);
    });
});
