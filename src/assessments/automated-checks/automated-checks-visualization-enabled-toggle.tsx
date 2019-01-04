// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { isEmpty } from 'lodash';

import { IGeneratedAssessmentInstance, ITestStepResult } from '../../common/types/store-data/iassessment-result-data';
import { AssessmentVisualizationEnabledToggle } from '../../DetailsView/components/assessment-visualization-enabled-toggle';
import { ManualTestStatus } from '../../common/types/manual-test-status';

function failingInstances(result: ITestStepResult) {
    return result.status === ManualTestStatus.FAIL;
}

export class AutomatedChecksVisualizationToggle extends AssessmentVisualizationEnabledToggle {
    protected isDisabled(passingOrFailingInstances: IGeneratedAssessmentInstance<{}, {}>[]): boolean {
        const selectedTestStep = this.props.assessmentNavState.selectedTestStep;
        if (isEmpty(passingOrFailingInstances)) {
            return true;
        }

        const relevantTestStepResults = this.getRelevantTestStepResults(passingOrFailingInstances, selectedTestStep);

        const failingInstanceKeys = relevantTestStepResults.filter(failingInstances);

        return isEmpty(failingInstanceKeys);
    }

    private getRelevantTestStepResults(instances: IGeneratedAssessmentInstance<{}, {}>[], selectedTestStep: string): ITestStepResult[] {
        const getSelectedTestStepResult: (instance: string) => ITestStepResult = (instance: string) => {
            return instances[instance].testStepResults[selectedTestStep];
        };
        return Object.keys(instances)
            .map(getSelectedTestStepResult)
            .filter(ob => ob);
    }
}
