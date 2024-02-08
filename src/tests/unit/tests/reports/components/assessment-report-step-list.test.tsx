// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import { ManualTestStatus } from 'common/types/store-data/manual-test-status';
import * as React from 'react';
import {
    AssessmentReportStepList,
    AssessmentReportStepListDeps,
    AssessmentReportStepListProps,
} from 'reports/components/assessment-report-step-list';
import { AssessmentReportStepHeader } from '../../../../../reports/components/assessment-report-step-header';
import { ReportInstanceList } from '../../../../../reports/components/report-instance-list';
import {
    expectMockedComponentPropsToMatchSnapshots,
    mockReactComponents,
} from '../../../mock-helpers/mock-module-helpers';
import { AssessmentReportBuilderTestHelper } from '../../DetailsView/assessment-report-builder-test-helper';
jest.mock('../../../../../reports/components/assessment-report-step-header');
jest.mock('../../../../../reports/components/report-instance-list');

describe('AssessmentReportStepListTest', () => {
    mockReactComponents([AssessmentReportStepHeader, ReportInstanceList]);
    const deps: AssessmentReportStepListDeps = {
        outcomeTypeSemanticsFromTestStatus: { stub: 'outcomeTypeSemanticsFromTestStatus' } as any,
    } as AssessmentReportStepListDeps;

    it('renders pass', () => {
        const props: AssessmentReportStepListProps = {
            deps: deps,
            status: ManualTestStatus.PASS,
            steps: AssessmentReportBuilderTestHelper.getRequirementReportModelPass(),
        };

        const renderResult = render(<AssessmentReportStepList {...props} />);
        expect(renderResult.asFragment()).toMatchSnapshot();
        expectMockedComponentPropsToMatchSnapshots([
            AssessmentReportStepHeader,
            ReportInstanceList,
        ]);
    });

    it('renders pass without instances when showInstances is false', () => {
        const steps = AssessmentReportBuilderTestHelper.getRequirementReportModelPass();
        steps[0].showPassingInstances = false;
        const props: AssessmentReportStepListProps = {
            deps: deps,
            status: ManualTestStatus.PASS,
            steps,
        };

        const renderResult = render(<AssessmentReportStepList {...props} />);
        expect(renderResult.asFragment()).toMatchSnapshot();
        expectMockedComponentPropsToMatchSnapshots([
            AssessmentReportStepHeader,
            ReportInstanceList,
        ]);
    });

    it('renders fail', () => {
        const props: AssessmentReportStepListProps = {
            deps: deps,
            status: ManualTestStatus.FAIL,
            steps: AssessmentReportBuilderTestHelper.getRequirementReportModelFail(),
        };

        const renderResult = render(<AssessmentReportStepList {...props} />);
        expect(renderResult.asFragment()).toMatchSnapshot();
    });

    it('renders incomplete', () => {
        const props: AssessmentReportStepListProps = {
            deps: deps,
            status: ManualTestStatus.UNKNOWN,
            steps: AssessmentReportBuilderTestHelper.getRequirementReportModelUnknownStep3(),
        };

        const renderResult = render(<AssessmentReportStepList {...props} />);
        expect(renderResult.asFragment()).toMatchSnapshot();
        expectMockedComponentPropsToMatchSnapshots([
            AssessmentReportStepHeader,
            ReportInstanceList,
        ]);
    });
});
