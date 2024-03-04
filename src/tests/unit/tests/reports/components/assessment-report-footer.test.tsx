// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import * as React from 'react';
import {
    AssessmentReportFooter,
    AssessmentReportFooterProps,
} from 'reports/components/assessment-report-footer';

describe('AssessmentReportFooter', () => {
    it('renders', () => {
        const props: AssessmentReportFooterProps = {
            extensionVersion: 'test-extension-version',
            axeVersion: 'axeVersion',
            chromeVersion: 'chromeVersion',
        };

        const renderResult = render(<AssessmentReportFooter {...props} />);

        expect(renderResult.asFragment()).toMatchSnapshot();
    });
});
