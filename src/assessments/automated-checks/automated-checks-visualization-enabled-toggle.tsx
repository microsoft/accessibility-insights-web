// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { ManualTestStatus } from 'common/types/manual-test-status';
import {
    GeneratedAssessmentInstance,
    TestStepResult,
} from 'common/types/store-data/assessment-result-data';
import { AssessmentVisualizationEnabledToggle } from 'DetailsView/components/assessment-visualization-enabled-toggle';
import { isEmpty } from 'lodash';

function failingInstances(result: TestStepResult): boolean {
    return result.status === ManualTestStatus.FAIL;
}

export class AutomatedChecksVisualizationToggle extends AssessmentVisualizationEnabledToggle {
    protected isDisabled(
        passingOrFailingInstances: GeneratedAssessmentInstance<{}, {}>[],
    ): boolean {
        const selectedTestStep = this.props.assessmentNavState.selectedTestSubview;
        if (isEmpty(passingOrFailingInstances)) {
            return true;
        }

        const relevantTestStepResults = this.getRelevantTestStepResults(
            passingOrFailingInstances,
            selectedTestStep,
        );

        const failingInstanceKeys = relevantTestStepResults.filter(failingInstances);

        return isEmpty(failingInstanceKeys);
    }

    private getRelevantTestStepResults(
        instances: GeneratedAssessmentInstance<{}, {}>[],
        selectedTestStep: string,
    ): TestStepResult[] {
        const getSelectedTestStepResult: (instance: string) => TestStepResult = (
            instance: string,
        ) => {
            return instances[instance].testStepResults[selectedTestStep];
        };
        return Object.keys(instances)
            .map(getSelectedTestStepResult)
            .filter(ob => ob);
    }
}
