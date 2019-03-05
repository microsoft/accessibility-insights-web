// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentViewProps } from '../components/assessment-view';
import { detailsViewExtensionPoint } from './details-view-extension-point';

function isRunning(props: AssessmentViewProps): boolean {
    const { assessmentTestResult } = props;
    const results = assessmentTestResult.getOutcomeStats();
    return results.incomplete > 0;
}

function onAssessmentViewUpdate(prevProps: AssessmentViewProps, curProps: AssessmentViewProps) {
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
