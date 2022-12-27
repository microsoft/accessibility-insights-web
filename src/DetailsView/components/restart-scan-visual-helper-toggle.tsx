// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { GeneratedAssessmentInstance } from '../../common/types/store-data/assessment-result-data';
import { BaseVisualHelperToggle } from './base-visual-helper-toggle';

export class RestartScanVisualHelperToggle extends BaseVisualHelperToggle {
    protected isDisabled(instances: GeneratedAssessmentInstance<{}, {}>[]): boolean {
        return false;
    }

    protected isChecked(instances: GeneratedAssessmentInstance<{}, {}>[]): boolean {
        return this.props.isStepEnabled;
    }

    protected onClick = (event): void => {
        if (this.props.isStepEnabled) {
            this.props.deps
                .getAssessmentActionMessageCreator()
                .disableVisualHelper(
                    this.props.assessmentNavState.selectedTestType,
                    this.props.assessmentNavState.selectedTestSubview,
                );
        } else {
            this.props.deps
                .getAssessmentActionMessageCreator()
                .enableVisualHelper(
                    this.props.assessmentNavState.selectedTestType,
                    this.props.assessmentNavState.selectedTestSubview,
                );
        }
    };
}
