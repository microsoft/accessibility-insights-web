// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import * as renderer from 'react-test-renderer';

import {
    AssessmentReportFooter,
    IAssessmentReportFooterProps,
} from '../../../../../DetailsView/reports/components/assessment-report-footer';


describe('AssessmentReportFooter', () => {
    it('renders', () => {
        const props: IAssessmentReportFooterProps = {
            extensionVersion: 'test-extension-version',
            axeVersion: 'axeVersion',
            chromeVersion: 'chromeVersion',
        };
        const tree = renderer
            .create(<AssessmentReportFooter {...props} />)
            .toJSON();

        expect(tree).toMatchSnapshot();
    });

});
