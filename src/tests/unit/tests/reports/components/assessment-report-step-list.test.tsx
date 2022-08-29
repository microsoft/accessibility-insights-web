// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ManualTestStatus } from 'common/types/store-data/manual-test-status';
import { shallow } from 'enzyme';
import * as React from 'react';
import {
    AssessmentReportStepList,
    AssessmentReportStepListDeps,
    AssessmentReportStepListProps,
} from 'reports/components/assessment-report-step-list';
import { AssessmentReportBuilderTestHelper } from '../../DetailsView/assessment-report-builder-test-helper';

describe('AssessmentReportStepListTest', () => {
    const deps: AssessmentReportStepListDeps = {
        outcomeTypeSemanticsFromTestStatus: { stub: 'outcomeTypeSemanticsFromTestStatus' } as any,
    } as AssessmentReportStepListDeps;

    it('renders pass', () => {
        const props: AssessmentReportStepListProps = {
            deps: deps,
            status: ManualTestStatus.PASS,
            steps: AssessmentReportBuilderTestHelper.getRequirementReportModelPass(),
        };

        const wrapper = shallow(<AssessmentReportStepList {...props} />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });

    it('renders pass without instances when showInstances is false', () => {
        const steps = AssessmentReportBuilderTestHelper.getRequirementReportModelPass();
        steps[0].showPassingInstances = false;
        const props: AssessmentReportStepListProps = {
            deps: deps,
            status: ManualTestStatus.PASS,
            steps,
        };

        const wrapper = shallow(<AssessmentReportStepList {...props} />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });

    it('renders fail', () => {
        const props: AssessmentReportStepListProps = {
            deps: deps,
            status: ManualTestStatus.FAIL,
            steps: AssessmentReportBuilderTestHelper.getRequirementReportModelFail(),
        };

        const wrapper = shallow(<AssessmentReportStepList {...props} />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });

    it('renders incomplete', () => {
        const props: AssessmentReportStepListProps = {
            deps: deps,
            status: ManualTestStatus.UNKNOWN,
            steps: AssessmentReportBuilderTestHelper.getRequirementReportModelUnknownStep3(),
        };

        const wrapper = shallow(<AssessmentReportStepList {...props} />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
