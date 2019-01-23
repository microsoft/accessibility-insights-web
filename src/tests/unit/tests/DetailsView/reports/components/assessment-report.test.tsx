// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { AssessmentReport, AssessmentReportDeps } from '../../../../../../DetailsView/reports/components/assessment-report';
import { shallowRender } from '../../../../Common/shallow-render';
import { AssessmentReportBuilderTestHelper } from '../../assessment-report-builder-test-helper';
import { outcomeTypeSemanticsFromTestStatus } from '../../../../../../DetailsView/reports/components/outcome-type';

describe('AssessmentReport', () => {
    test('render', () => {
        // TODO: Make this a local test function rather than importing the actual one
        const deps: AssessmentReportDeps = {
            outcomeTypeSemanticsFromTestStatus: outcomeTypeSemanticsFromTestStatus,
        };

        const data = AssessmentReportBuilderTestHelper.getAssessmentReportModel();

        expect(shallowRender(
            <AssessmentReport
                deps={deps}
                data={data}
                description="test string"
                extensionVersion="ProductVersion"
                axeVersion="axeVersion"
                chromeVersion="chromeVersion"
            />,
        )).toMatchSnapshot();
    });
});
