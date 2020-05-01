// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentViewProps } from 'DetailsView/components/assessment-view';
import { AssessmentTestResult } from '../../common/assessment/assessment-test-result';
import { reactExtensionPoint } from '../../common/extensibility/react-extension-point';
import { VisualizationType } from '../../common/types/visualization-type';

export type WithAssessmentTestResult = { assessmentTestResult: AssessmentTestResult };
export const AssessmentViewMainContentExtensionPoint = reactExtensionPoint<
    WithAssessmentTestResult
>('AssessmentViewMainContentExtensionPoint');

export class AssessmentViewUpdateHandler {
    public static readonly requirementsTitle: string = 'Requirements';

    public onMount(props: AssessmentViewProps): void {
        this.enableSelectedStepVisualHelper(props);
    }

    public onUnmount(props: AssessmentViewProps): void {
        this.disableVisualHelpersForSelectedTest(props);
    }

    public update(prevProps: AssessmentViewProps, currentProps: AssessmentViewProps): void {
        if (this.isStepSwitched(prevProps, currentProps)) {
            this.disableVisualHelpersForSelectedTest(prevProps);
            this.enableSelectedStepVisualHelper(currentProps);
        } else {
            // Cases where visualization doesn't reappear(Navigate back, refresh). No telemetry sent.
            this.enableSelectedStepVisualHelper(currentProps, false);
        }
    }

    private enableSelectedStepVisualHelper(props: AssessmentViewProps, sendTelemetry = true): void {
        const test = props.assessmentNavState.selectedTestType;
        const step = props.assessmentNavState.selectedTestStep;
        if (this.visualHelperDisabledByDefault(props, test, step) || this.isTargetChanged(props)) {
            return;
        }

        const isStepNotScanned = !props.assessmentData.testStepStatus[step].isStepScanned;
        if (props.isEnabled === false || isStepNotScanned) {
            props.deps.detailsViewActionMessageCreator.enableVisualHelper(
                test,
                step,
                isStepNotScanned,
                sendTelemetry,
            );
        }
    }

    private isTargetChanged(props: AssessmentViewProps): boolean {
        return props.prevTarget != null && props.prevTarget.id !== props.currentTarget.id;
    }

    private isStepSwitched(
        prevProps: AssessmentViewProps,
        currentProps: AssessmentViewProps,
    ): boolean {
        return (
            prevProps.assessmentNavState.selectedTestStep !==
            currentProps.assessmentNavState.selectedTestStep
        );
    }

    private visualHelperDisabledByDefault(
        props: AssessmentViewProps,
        test: VisualizationType,
        step: string,
    ): boolean {
        return props.deps.assessmentsProvider.getStep(test, step).doNotScanByDefault === true;
    }

    private disableVisualHelpersForSelectedTest(props: AssessmentViewProps): void {
        const test = props.assessmentNavState.selectedTestType;
        props.deps.detailsViewActionMessageCreator.disableVisualHelpersForTest(test);
    }
}
