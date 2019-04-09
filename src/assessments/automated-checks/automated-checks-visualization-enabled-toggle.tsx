// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { isEmpty } from 'lodash';

import { ManualTestStatus } from '../../common/types/manual-test-status';
import { IGeneratedAssessmentInstance, ITestStepResult } from '../../common/types/store-data/assessment-result-data';
import { AssessmentVisualizationEnabledToggle } from '../../DetailsView/components/assessment-visualization-enabled-toggle';

function failingInstances(result: ITestStepResult): boolean {
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
