// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { AssessmentReportBody } from '../../../../../../DetailsView/reports/components/assessment-report-body';
import { shallowRender } from '../../../../common/shallow-render';
import { AssessmentReportBuilderTestHelper } from '../../assessment-report-builder-test-helper';

describe('AssessmentReportBody', () => {

    test('render', () => {
        const props = {
            data: AssessmentReportBuilderTestHelper.getAssessmentReportModel(),
            description: 'test-description',
        };

        expect(shallowRender(<AssessmentReportBody {...props} />)).toMatchSnapshot();
    });
});
