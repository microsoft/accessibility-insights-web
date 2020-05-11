// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { GeneratedAssessmentInstance } from 'common/types/store-data/assessment-result-data';
import { isEmpty } from 'lodash';

import { BaseVisualHelperToggle } from './base-visual-helper-toggle';

export class AssessmentVisualizationEnabledToggle extends BaseVisualHelperToggle {
    protected isDisabled(filteredInstances: GeneratedAssessmentInstance<{}, {}>[]): boolean {
        return isEmpty(filteredInstances);
    }

    protected isChecked(instances: GeneratedAssessmentInstance<{}, {}>[]): boolean {
        return this.isAnyInstanceVisible(instances);
    }

    protected onClick = (event): void => {
        this.props.deps.detailsViewActionMessageCreator.changeAssessmentVisualizationStateForAll(
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
        return instances.some(
            instance =>
                instance.testStepResults[this.props.assessmentNavState.selectedTestSubview]
                    .isVisualizationEnabled,
        );
    }
}
