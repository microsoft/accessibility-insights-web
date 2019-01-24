// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as _ from 'lodash/index';
import { autobind } from '@uifabric/utilities';

import { IGeneratedAssessmentInstance } from '../../common/types/store-data/iassessment-result-data';
import { BaseVisualHelperToggle } from './base-visual-helper-toggle';

export class AssessmentVisualizationEnabledToggle extends BaseVisualHelperToggle {
    protected isDisabled(filteredInstances: IGeneratedAssessmentInstance<{}, {}>[]): boolean {
        return _.isEmpty(filteredInstances);
    }

    protected isChecked(instances: IGeneratedAssessmentInstance<{}, {}>[]): boolean {
        return this.isAnyInstanceVisible(instances);
    }

    @autobind
    protected onClick(event): void {
        this.props.actionMessageCreator.changeAssessmentVisualizationStateForAll(
            !this.isAnyInstanceVisible(this.filterInstancesByTestStep(this.props.assessmentNavState, this.props.instancesMap)),
            this.props.assessmentNavState.selectedTestType,
            this.props.assessmentNavState.selectedTestStep,
        );
    }

    private isAnyInstanceVisible(instances: IGeneratedAssessmentInstance<{}, {}>[]): boolean {
        return instances.some(instance => instance.testStepResults[this.props.assessmentNavState.selectedTestStep].isVisualizationEnabled);
    }
}
