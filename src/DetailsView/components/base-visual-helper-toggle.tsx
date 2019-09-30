// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { VisualHelperToggleConfig } from 'assessments/types/requirement';
import * as _ from 'lodash';
import * as React from 'react';
import { VisualizationToggle } from '../../common/components/visualization-toggle';
import { GeneratedAssessmentInstance } from '../../common/types/store-data/assessment-result-data';
import { DictionaryStringTo } from '../../types/common-types';

export const visualHelperText = 'Visual helper';

export abstract class BaseVisualHelperToggle extends React.Component<VisualHelperToggleConfig> {
    public render(): JSX.Element {
        const filteredInstances = this.filterInstancesByTestStep(this.props.assessmentNavState, this.props.instancesMap);
        const isDisabled: boolean = this.isDisabled(filteredInstances);
        const disabledMessage = this.renderNoMatchingElementsMessage(isDisabled);
        const onClick = this.onClick;
        const isChecked = this.isChecked(filteredInstances);

        return (
            <div className="visual-helper">
                <div className="visual-helper-text">{visualHelperText}</div>
                <VisualizationToggle
                    checked={isChecked}
                    disabled={isDisabled}
                    onClick={onClick}
                    className="visual-helper-toggle"
                    visualizationName={visualHelperText}
                />
                {disabledMessage}
            </div>
        );
    }

    protected abstract isDisabled(filteredInstances: GeneratedAssessmentInstance<{}, {}>[]): boolean;

    protected abstract isChecked(instances: GeneratedAssessmentInstance<{}, {}>[]): boolean;

    protected filterInstancesByTestStep(
        assessmentNavState,
        instancesMap: DictionaryStringTo<GeneratedAssessmentInstance>,
    ): GeneratedAssessmentInstance<{}, {}>[] {
        const selectedTestStep = assessmentNavState.selectedTestStep;

        return _.filter(instancesMap, instance => {
            if (instance == null) {
                return false;
            }

            const testStepKeys = _.keys(instance.testStepResults);
            return _.includes(testStepKeys, selectedTestStep) && instance.testStepResults[selectedTestStep] != null;
        });
    }

    private renderNoMatchingElementsMessage(isDisabled: boolean): JSX.Element {
        if (isDisabled) {
            return <span className="no-matching-elements">No matching/failing instances were found</span>;
        }

        return null;
    }

    protected abstract onClick: (event: any) => void;
}
