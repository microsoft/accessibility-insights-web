// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { ManualTestStatus } from '../../../../../../common/types/manual-test-status';
import {
    AssessmentReportStepList,
    AssessmentReportStepListDeps,
    AssessmentReportStepListProps,
} from '../../../../../../DetailsView/reports/components/assessment-report-step-list';
import { shallowRender } from '../../../../Common/shallow-render';
import { AssessmentReportBuilderTestHelper } from '../../assessment-report-builder-test-helper';

describe('AssessmentReportStepListTest', () => {
    const deps: AssessmentReportStepListDeps = {
        outcomeTypeSemanticsFromTestStatus: { stub: 'outcomeTypeSemanticsFromTestStatus' } as any,
    };

    it('renders pass', () => {
        const props: AssessmentReportStepListProps = {
            deps: deps,
            status: ManualTestStatus.PASS,
            steps: AssessmentReportBuilderTestHelper.getRequirementReportModelPass(),
        };

        const shallow = shallowRender(<AssessmentReportStepList {...props} />);
        expect(shallow).toMatchSnapshot(); //
    });

    it('renders pass without instances when showInstances is false', () => {
        const steps = AssessmentReportBuilderTestHelper.getRequirementReportModelPass();
        steps[0].showPassingInstances = false;
        const props: AssessmentReportStepListProps = {
            deps: deps,
            status: ManualTestStatus.PASS,
            steps,
        };

        const shallow = shallowRender(<AssessmentReportStepList {...props} />);
        expect(shallow).toMatchSnapshot(); //
    });

    it('renders fail', () => {
        const props: AssessmentReportStepListProps = {
            deps: deps,
            status: ManualTestStatus.FAIL,
            steps: AssessmentReportBuilderTestHelper.getRequirementReportModelFail(),
        };

        const shallow = shallowRender(<AssessmentReportStepList {...props} />);
        expect(shallow).toMatchSnapshot();
    });

    it('renders incomplete', () => {
        const props: AssessmentReportStepListProps = {
            deps: deps,
            status: ManualTestStatus.UNKNOWN,
            steps: AssessmentReportBuilderTestHelper.getRequirementReportModelUnknownStep3(),
        };

        const shallow = shallowRender(<AssessmentReportStepList {...props} />);
        expect(shallow).toMatchSnapshot();
    });
});
