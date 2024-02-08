// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import * as React from 'react';
import { UrlErrorsTable } from 'reports/components/report-sections/url-errors-table';
import { SummaryResultsTable } from '../../../../../../reports/components/report-sections/summary-results-table';
import { NewTabLink } from '../../../../../../common/components/new-tab-link';
import {
    expectMockedComponentPropsToMatchSnapshots,
    mockReactComponents,
} from '../../../../mock-helpers/mock-module-helpers';
jest.mock('../../../../../../reports/components/report-sections/summary-results-table');
jest.mock('../../../../../../common/components/new-tab-link');

describe(UrlErrorsTable.displayName, () => {
    mockReactComponents([SummaryResultsTable, NewTabLink]);
    it('renders', () => {
        const errors = [
            {
                url: 'https://url.com/1',
                errorType: 'type1',
                errorDescription: 'error description 1',
                errorLogLocation: 'error log file 1',
            },
            {
                url: 'https://url.com/2',
                errorType: 'type2',
                errorDescription: 'error description 2',
                errorLogLocation: 'error log file 2',
            },
            {
                url: 'https://url.com/3',
                errorType: 'type3',
                errorDescription: 'error description 3',
                errorLogLocation: 'error log file 3',
            },
        ];

        const renderResult = render(<UrlErrorsTable errors={errors} id="table-id" />);

        expect(renderResult.asFragment()).toMatchSnapshot();
        expectMockedComponentPropsToMatchSnapshots([SummaryResultsTable, NewTabLink]);
    });
});
