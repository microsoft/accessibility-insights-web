// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { AssessmentReport } from '../../../../../../DetailsView/reports/components/assessment-report';
import { shallowRender } from '../../../../Common/shallow-render';
import { AssessmentReportBuilderTestHelper } from '../../assessment-report-builder-test-helper';

describe('AssessmentReport', () => {
    test('render', () => {
        const props = { data: AssessmentReportBuilderTestHelper.getAssessmentReportModel() };
        expect(shallowRender(
            <AssessmentReport
                data={props.data}
                description="test string"
                extensionVersion="ProductVersion"
                axeVersion="axeVersion"
                chromeVersion="chromeVersion"
            />,
        )).toMatchSnapshot();
    });
});
