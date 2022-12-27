// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { GeneratedAssessmentInstance } from 'common/types/store-data/assessment-result-data';

import { BaseVisualHelperToggle } from './base-visual-helper-toggle';

export class AssessmentVisualizationEnabledToggle extends BaseVisualHelperToggle {
    protected isDisabled(instances: GeneratedAssessmentInstance<{}, {}>[]): boolean {
        return !this.isAnyInstanceVisualizable(instances);
    }

    protected isChecked(instances: GeneratedAssessmentInstance<{}, {}>[]): boolean {
        return this.isAnyInstanceVisible(instances);
    }

    protected onClick = (event): void => {
        this.props.deps
            .getAssessmentActionMessageCreator()
            .changeAssessmentVisualizationStateForAll(
                !this.isAnyInstanceVisible(
                    this.filterInstancesByTestStep(
                        this.props.assessmentNavState,
                        this.props.instancesMap,
                    ),
                ),
                this.props.assessmentNavState.selectedTestType,
                this.props.assessmentNavState.selectedTestSubview,
            );
    };

    private isAnyInstanceVisible(instances: GeneratedAssessmentInstance<{}, {}>[]): boolean {
        const testStep = this.props.assessmentNavState.selectedTestSubview;
        return instances.some(
            instance => instance.testStepResults[testStep].isVisualizationEnabled,
        );
    }

    private isAnyInstanceVisualizable(instances: GeneratedAssessmentInstance<{}, {}>[]): boolean {
        const testStep = this.props.assessmentNavState.selectedTestSubview;
        return instances.some(
            instance => instance.testStepResults[testStep].isVisualizationSupported,
        );
    }
}
