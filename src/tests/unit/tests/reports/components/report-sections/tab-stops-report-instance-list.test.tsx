// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import * as React from 'react';
import { TabStopsReportInstanceList } from 'reports/components/report-sections/tab-stops-report-instance-list';

describe('TabStopsReportInstanceList', () => {
    test('renders', () => {
        const props = {
            instances: [],
        };
        const renderResult = render(<TabStopsReportInstanceList {...props} />);
        expect(renderResult.asFragment()).toMatchSnapshot();
    });
});
