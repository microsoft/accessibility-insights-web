// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import {
    AssessmentData,
    AssessmentNavState,
    PersistedTabInfo,
} from 'common/types/store-data/assessment-result-data';
import { Tab } from 'common/types/store-data/itab';
import { AssessmentActionMessageCreator } from 'DetailsView/actions/assessment-action-message-creator';
import { isEqual } from 'lodash';
import { VisualizationType } from '../../common/types/visualization-type';

export interface AssessmentViewUpdateHandlerDeps {
    getAssessmentActionMessageCreator: () => AssessmentActionMessageCreator;
    getProvider: () => AssessmentsProvider;
}

export interface AssessmentViewUpdateHandlerProps {
    deps: AssessmentViewUpdateHandlerDeps;
    assessmentNavState: AssessmentNavState;
    assessmentData: AssessmentData;
    selectedRequirementIsEnabled: boolean;
    currentTarget: Tab;
    prevTarget: PersistedTabInfo;
}

export class AssessmentViewUpdateHandler {
    public static readonly requirementsTitle: string = 'Requirements';

    public onMount(props: AssessmentViewUpdateHandlerProps): void {
        this.enableSelectedStepVisualHelper(props);
    }

    public onUnmount(props: AssessmentViewUpdateHandlerProps): void {
        this.disableVisualHelpersForSelectedTest(props);
    }

    public update(
        prevProps: AssessmentViewUpdateHandlerProps,
        currentProps: AssessmentViewUpdateHandlerProps,
    ): void {
        if (this.isStepSwitched(prevProps, currentProps)) {
            this.disableVisualHelpersForSelectedTest(prevProps);
            this.enableSelectedStepVisualHelper(currentProps, prevProps);
        } else {
            // Cases where visualization doesn't reappear(Navigate back, refresh). No telemetry sent.
            this.enableSelectedStepVisualHelper(currentProps, prevProps, false);
        }
    }

    private enableSelectedStepVisualHelper(
        props: AssessmentViewUpdateHandlerProps,
        prevProps: AssessmentViewUpdateHandlerProps | undefined = undefined,
        sendTelemetry = true,
    ): void {
        const test = props.assessmentNavState.selectedTestType;
        const step = props.assessmentNavState.selectedTestSubview;
        if (this.visualHelperDisabledByDefault(props, test, step) || this.isTargetChanged(props)) {
            return;
        }

        const isStepNotScanned = !props.assessmentData.testStepStatus[step].isStepScanned;
        const assessmentDataUpdated = prevProps
            ? !isEqual(props.assessmentData, prevProps.assessmentData)
            : true;
        if (
            props.selectedRequirementIsEnabled === false ||
            (isStepNotScanned && assessmentDataUpdated)
        ) {
            props.deps
                .getAssessmentActionMessageCreator()
                .enableVisualHelper(test, step, isStepNotScanned, sendTelemetry);
        }
    }

    private isTargetChanged(props: AssessmentViewUpdateHandlerProps): boolean {
        return (
            props.prevTarget != null &&
            props.prevTarget.id != null &&
            props.prevTarget.id !== props.currentTarget.id
        );
    }

    private isStepSwitched(
        prevProps: AssessmentViewUpdateHandlerProps,
        currentProps: AssessmentViewUpdateHandlerProps,
    ): boolean {
        return (
            prevProps.assessmentNavState.selectedTestSubview !==
            currentProps.assessmentNavState.selectedTestSubview
        );
    }

    private visualHelperDisabledByDefault(
        props: AssessmentViewUpdateHandlerProps,
        test: VisualizationType,
        step: string,
    ): boolean {
        return props.deps.getProvider().getStep(test, step)!.doNotScanByDefault === true;
    }

    private disableVisualHelpersForSelectedTest(props: AssessmentViewUpdateHandlerProps): void {
        const test = props.assessmentNavState.selectedTestType;
        props.deps.getAssessmentActionMessageCreator().disableVisualHelpersForTest(test);
    }
}
