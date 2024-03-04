// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import * as React from 'react';
import { AssessmentReportBodyHeader } from 'reports/components/assessment-report-body-header';

describe('AssessmentReportBodyHeader', () => {
    describe('render', () => {
        test('render function test', () => {
            const renderResult = render(<AssessmentReportBodyHeader />);
            expect(renderResult.asFragment()).toMatchSnapshot();
        });
    });
});
