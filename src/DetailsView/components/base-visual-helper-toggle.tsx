// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { VisualHelperToggleConfig } from 'assessments/types/requirement';
import { filter, includes, keys } from 'lodash';
import * as React from 'react';
import { VisualizationToggle } from '../../common/components/visualization-toggle';
import { GeneratedAssessmentInstance } from '../../common/types/store-data/assessment-result-data';
import { DictionaryStringTo } from '../../types/common-types';

export const visualHelperToggleAutomationId = 'visual-helper-toggle';
export const visualHelperText = 'Visual helper';

export abstract class BaseVisualHelperToggle extends React.Component<VisualHelperToggleConfig> {
    public render(): JSX.Element {
        const filteredInstances = this.filterInstancesByTestStep(
            this.props.assessmentNavState,
            this.props.instancesMap,
        );
        const isDisabled: boolean = this.isDisabled(filteredInstances);
        const disabledMessage = this.renderNoMatchingElementsMessage(isDisabled);
        const onClick = this.onClick;
        const isChecked = this.isChecked(filteredInstances);

        return (
            <div className="visual-helper">
                <div className="visual-helper-text">{visualHelperText}</div>
                <div aria-hidden={isDisabled} /* disabledMessage supersedes it; see #682 */>
                    <VisualizationToggle
                        checked={isChecked}
                        disabled={isDisabled}
                        onClick={onClick}
                        className="visual-helper-toggle"
                        visualizationName={visualHelperText}
                        data-automation-id={visualHelperToggleAutomationId}
                    />
                </div>
                {disabledMessage}
            </div>
        );
    }

    protected abstract isDisabled(
        filteredInstances: GeneratedAssessmentInstance<{}, {}>[],
    ): boolean;

    protected abstract isChecked(instances: GeneratedAssessmentInstance<{}, {}>[]): boolean;

    protected filterInstancesByTestStep(
        assessmentNavState,
        instancesMap: DictionaryStringTo<GeneratedAssessmentInstance>,
    ): GeneratedAssessmentInstance<{}, {}>[] {
        const selectedTestSubview = assessmentNavState.selectedTestSubview;

        return filter(instancesMap, instance => {
            if (instance == null) {
                return false;
            }

            const testStepKeys = keys(instance.testStepResults);
            return (
                includes(testStepKeys, selectedTestSubview) &&
                instance.testStepResults[selectedTestSubview] != null
            );
        });
    }

    private renderNoMatchingElementsMessage(isDisabled: boolean): JSX.Element | null {
        if (isDisabled) {
            return (
                <span className="no-matching-elements">
                    No matching/failing instances were found
                </span>
            );
        }

        return null;
    }

    protected abstract onClick: (event: any) => void;
}
