// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import { UrlErrorsTable } from 'reports/components/report-sections/url-errors-table';

describe(UrlErrorsTable.displayName, () => {
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

        const wrapper = shallow(<UrlErrorsTable errors={errors} id="table-id" />);

        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
