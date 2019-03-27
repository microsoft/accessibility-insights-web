// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { autobind } from '@uifabric/utilities';

import { IGeneratedAssessmentInstance } from '../../common/types/store-data/iassessment-result-data';
import { BaseVisualHelperToggle } from './base-visual-helper-toggle';

export class RestartScanVisualHelperToggle extends BaseVisualHelperToggle {
    protected isDisabled(instances: IGeneratedAssessmentInstance<{}, {}>[]): boolean {
        return false;
    }

    protected isChecked(instances: IGeneratedAssessmentInstance<{}, {}>[]): boolean {
        return this.props.isRequirementEnabled;
    }

    @autobind
    protected onClick(event): void {
        if (this.props.isRequirementEnabled) {
            this.props.actionMessageCreator.disableVisualHelper(
                this.props.assessmentNavState.selectedTestType,
                this.props.assessmentNavState.selectedTestStep,
            );
        } else {
            this.props.actionMessageCreator.enableVisualHelper(
                this.props.assessmentNavState.selectedTestType,
                this.props.assessmentNavState.selectedTestStep,
            );
        }
    }
}
