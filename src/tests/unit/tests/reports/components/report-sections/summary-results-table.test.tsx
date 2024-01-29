// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import * as React from 'react';
import {
    SummaryResultsTable,
    TableColumn,
} from 'reports/components/report-sections/summary-results-table';

describe(SummaryResultsTable.displayName, () => {
    it('renders', () => {
        const columns: TableColumn[] = [
            {
                header: 'heading1',
                contentType: 'text',
            },
            {
                header: 'heading2',
                contentType: 'url',
            },
            {
                header: 'heading3',
                contentType: 'text',
            },
        ];
        const rows = [
            ['cell1', 'cell2', <div key="cell3">cell3</div>],
            ['cell4', 'cell5', <div key="cell6">cell6</div>],
        ];
        const renderResult = render(<SummaryResultsTable columns={columns} rows={rows} id="table-id" />);
        expect(renderResult.asFragment()).toMatchSnapshot();
    });
});
