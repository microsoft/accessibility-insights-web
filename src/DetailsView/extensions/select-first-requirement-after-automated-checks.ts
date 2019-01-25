// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IAssessmentViewProps } from '../components/assessment-view';
import { detailsViewExtensionPoint } from './details-view-extension-point';

function isRunning(props: IAssessmentViewProps): boolean {
    const { assessmentTestResult } = props;
    const results = assessmentTestResult.getOutcomeStats();
    return results.incomplete > 0;
}

function onAssessmentViewUpdate(prevProps: IAssessmentViewProps, curProps: IAssessmentViewProps) {
    const { assessmentTestResult } = curProps;
    const prevIsRunning = isRunning(prevProps);
    const nowIsRunning = isRunning(curProps);
    if (prevIsRunning && !nowIsRunning) {
        curProps.deps.detailsViewActionMessageCreator.selectTestStep(
            null,
            assessmentTestResult.getRequirementResults()[0].definition.key,
            assessmentTestResult.type,
        );
    }
}

export const selectFirstRequirementAfterAutomatedChecks = detailsViewExtensionPoint.define({
    onAssessmentViewUpdate,
});
