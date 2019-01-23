// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import {
    AssessmentReportBody,
    AssessmentReportBodyDeps,
    AssessmentReportBodyProps,
} from '../../../../../../DetailsView/reports/components/assessment-report-body';
import { outcomeTypeSemanticsFromTestStatus } from '../../../../../../DetailsView/reports/components/outcome-type';
import { shallowRender } from '../../../../common/shallow-render';
import { AssessmentReportBuilderTestHelper } from '../../assessment-report-builder-test-helper';

describe('AssessmentReportBody', () => {

    test('render', () => {
        // TODO: Make this a local test function rather than importing the actual one
        const deps: AssessmentReportBodyDeps = {
            outcomeTypeSemanticsFromTestStatus: outcomeTypeSemanticsFromTestStatus,
        };

        const props: AssessmentReportBodyProps = {
            deps: deps,
            data: AssessmentReportBuilderTestHelper.getAssessmentReportModel(),
            description: 'test-description',
        };

        expect(shallowRender(<AssessmentReportBody {...props} />)).toMatchSnapshot();
    });
});
