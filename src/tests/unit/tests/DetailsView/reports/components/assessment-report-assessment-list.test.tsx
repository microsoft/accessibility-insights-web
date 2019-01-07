// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as Enzyme from 'enzyme';
import * as React from 'react';

import { ManualTestStatus } from '../../../../../../common/types/manual-test-status';
import { IAssessmentDetailsReportModel } from '../../../../../../DetailsView/reports/assessment-report-model';
import {
    AssessmentReportAssessmentList,
    AssessmentReportAssessmentProps,
} from '../../../../../../DetailsView/reports/components/assessment-report-assessment-list';
import { AssessmentReportBuilderTestHelper } from '../../assessment-report-builder-test-helper';

describe('AssessmentReportAssessmentListTest', () => {
    test('render: pass', () => {
        const assessments: AssessmentReportAssessmentProps = {
            status: ManualTestStatus.PASS,
            assessments: AssessmentReportBuilderTestHelper.getAssessmentDetailsReportModelPass(),
        };

        testAssessments(assessments);
    });

    test('render: fail', () => {
        const assessments: AssessmentReportAssessmentProps = {
            status: ManualTestStatus.FAIL,
            assessments: AssessmentReportBuilderTestHelper.getAssessmentDetailsReportModelFail(),
        };

        testAssessments(assessments);
    });

    test('render: incomplete', () => {
        const assessments: AssessmentReportAssessmentProps = {
            status: ManualTestStatus.UNKNOWN,
            assessments: AssessmentReportBuilderTestHelper.getAssessmentDetailsReportModelUnknown(),
        };

        testAssessments(assessments);
    });

    function testAssessments(assessments: AssessmentReportAssessmentProps): void {
        const wrapper = Enzyme.shallow(<AssessmentReportAssessmentList {...assessments} />);

        assessments.assessments.forEach((assessment, index) => {
            const assessmentDiv = wrapper.childAt(index);
            expect(assessmentDiv.children()).toHaveLength(2);
            expect(assessmentDiv.hasClass('assessment-details')).toBeTruthy();
            expect(assessmentDiv.key()).toEqual(assessment.key);

            testAssessmentHeader(assessment, assessmentDiv.childAt(0));
        });
    }

    function testAssessmentHeader(assessment: IAssessmentDetailsReportModel, assessmentHeader: Enzyme.ShallowWrapper<any, any>): void {
        expect(assessmentHeader.hasClass('assessment-header')).toBeTruthy();
        expect(assessmentHeader.children()).toHaveLength(2);

        const headerName = assessmentHeader.childAt(0);
        expect(headerName.hasClass('assessment-header-name')).toBeTruthy();
        expect(headerName.text()).toEqual(assessment.displayName);
    }
});
