// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { RenderResult, render } from '@testing-library/react';
import { ManualTestStatus } from 'common/types/store-data/manual-test-status';
import * as React from 'react';

import { AssessmentDetailsReportModel } from 'reports/assessment-report-model';
import {
    AssessmentReportAssessmentList,
    AssessmentReportAssessmentListDeps,
    AssessmentReportAssessmentListProps,
} from 'reports/components/assessment-report-assessment-list';
import { AssessmentReportStepList, AssessmentReportStepListDeps } from 'reports/components/assessment-report-step-list';
import { AssessmentReportBuilderTestHelper } from '../../DetailsView/assessment-report-builder-test-helper';
import { AssessmentReportStepHeader } from '../../../../../reports/components/assessment-report-step-header';
import { OutcomeChip } from '../../../../../reports/components/outcome-chip';
import { mockReactComponents } from '../../../mock-helpers/mock-module-helpers';
jest.mock('reports/components/assessment-report-step-list');
jest.mock('../../../../../reports/components/outcome-chip');
jest.mock('../../../../../reports/components/assessment-report-step-header');

describe('AssessmentReportAssessmentListTest', () => {
    mockReactComponents([AssessmentReportStepHeader, AssessmentReportStepList, OutcomeChip]);
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
        assessments.assessments.forEach((assessment, index) => {
            expect(wrapper.container.querySelector('.assessment-details')).not.toBeNull();
            expect(wrapper.getByText(assessment.displayName)).not.toBeNull();
            testAssessmentHeader(assessment, wrapper);
        });

        expect(wrapper.asFragment()).toMatchSnapshot();
    }

    function testAssessmentHeader(
        assessment: AssessmentDetailsReportModel, wrapper: RenderResult
    ): void {
        expect(wrapper.container.querySelector('.assessment-details')).not.toBeNull();
        expect(wrapper.getByText(assessment.displayName)).not.toBeNull();
    }
});
