// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import { ToolData } from 'common/types/store-data/unified-data-interface';
import * as React from 'react';
import { ReportFooter } from 'reports/components/report-sections/report-footer';

describe('ReportFooter', () => {
    it('renders', () => {
        const toolData: ToolData = {
            scanEngineProperties: {
                name: 'engine-name',
                version: 'engine-version',
            },
            applicationProperties: {
                name: 'app-name',
                version: 'app-version',
                environmentName: 'environmentName',
            },
        };

        const renderResult = render(<ReportFooter {...{ toolData }}>Footer Text</ReportFooter>);

        expect(renderResult.asFragment()).toMatchSnapshot();
    });
});
