// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import { SummaryResultsTable } from 'reports/components/report-sections/summary-results-table';

describe(SummaryResultsTable, () => {
    it('renders', () => {
        const headings = ['heading1', 'heading2', 'heading3'];
        const rows = [
            ['cell1', 'cell2', <div>cell3</div>],
            ['cell4', 'cell5', <div>cell6</div>],
        ];
        const wrapped = shallow(<SummaryResultsTable columnHeaders={headings} rows={rows} />);
        expect(wrapped.getElement()).toMatchSnapshot();
    });
});
