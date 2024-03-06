// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import { ManualTestStatus } from 'common/types/store-data/manual-test-status';
import * as React from 'react';
import { AssessmentDetailsReportModel } from 'reports/assessment-report-model';
import {
    AssessmentReportAssessmentList,
    AssessmentReportAssessmentListDeps,
    AssessmentReportAssessmentListProps,
} from 'reports/components/assessment-report-assessment-list';
import {
    AssessmentReportStepList,
    AssessmentReportStepListDeps,
} from 'reports/components/assessment-report-step-list';
import { OutcomeChip } from '../../../../../reports/components/outcome-chip';
import {
    expectMockedComponentPropsToMatchSnapshots,
    mockReactComponents,
} from '../../../mock-helpers/mock-module-helpers';
import { AssessmentReportBuilderTestHelper } from '../../DetailsView/assessment-report-builder-test-helper';
jest.mock('reports/components/assessment-report-step-list');
jest.mock('../../../../../reports/components/outcome-chip');

describe('AssessmentReportAssessmentListTest', () => {
    mockReactComponents([AssessmentReportStepList, OutcomeChip]);
    const deps: AssessmentReportAssessmentListDeps = {
        outcomeTypeSemanticsFromTestStatus: { stub: 'outcomeTypeSemanticsFromTestStatus' } as any,
    } as AssessmentReportStepListDeps;

    test('render: pass', () => {
        const assessments: AssessmentReportAssessmentListProps = {
            deps: deps,
            status: ManualTestStatus.PASS,
            assessments: AssessmentReportBuilderTestHelper.getAssessmentDetailsReportModelPass(),
        };

        testAssessments(assessments);
    });

    test('render: fail', () => {
        const assessments: AssessmentReportAssessmentListProps = {
            deps: deps,
            status: ManualTestStatus.FAIL,
            assessments: AssessmentReportBuilderTestHelper.getAssessmentDetailsReportModelFail(),
        };

        testAssessments(assessments);
    });

    test('render: incomplete', () => {
        const assessments: AssessmentReportAssessmentListProps = {
            deps: deps,
            status: ManualTestStatus.UNKNOWN,
            assessments: AssessmentReportBuilderTestHelper.getAssessmentDetailsReportModelUnknown(),
        };

        testAssessments(assessments);
    });

    function testAssessments(assessments: AssessmentReportAssessmentListProps): void {
        const wrapper = render(<AssessmentReportAssessmentList {...assessments} />);
        const wrappingDiv = wrapper.container.firstElementChild;
        assessments.assessments.forEach((assessment, index) => {
            const assessmentDiv = wrappingDiv.children[index];
            expect(assessmentDiv.childNodes.length).toBe(2);
            expect(assessmentDiv.classList.contains('assessment-details')).toBe(true);

            testAssessmentHeader(assessment, assessmentDiv.children[0]);
        });

        expect(wrapper.asFragment()).toMatchSnapshot();
        expectMockedComponentPropsToMatchSnapshots([AssessmentReportStepList]);
    }

    function testAssessmentHeader(
        assessment: AssessmentDetailsReportModel,
        assessmentHeader: Element,
    ): void {
        expect(assessmentHeader.classList.contains('assessment-header')).toBe(true);
        expect(assessmentHeader.childNodes.length).toBe(2);

        const headerName = assessmentHeader.childNodes[0];
        expect(headerName.textContent).toBe(assessment.displayName);
    }
});
