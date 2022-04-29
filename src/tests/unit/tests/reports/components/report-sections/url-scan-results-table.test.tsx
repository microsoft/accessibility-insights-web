// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import { UrlScanResultsTable } from 'reports/components/report-sections/url-scan-results-table';

describe(UrlScanResultsTable.displayName, () => {
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

        const wrapper = shallow(<UrlScanResultsTable results={results} id="table-id" />);

        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
