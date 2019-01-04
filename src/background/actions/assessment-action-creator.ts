// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { autobind } from '@uifabric/utilities';

import { Messages } from '../../common/messages';
import * as TelemetryEvents from '../../common/telemetry-events';
import { IScanBasePayload, IScanCompletedPayload, IScanUpdatePayload } from '../../injected/analyzers/ianalyzer';
import { TelemetryEventHandler } from '../telemetry/telemetry-event-handler';
import {
    IAddFailureInstancePayload,
    IAssessmentActionInstancePayload,
    IChangeAssessmentStepStatusPayload,
    IChangeInstanceSelectionPayload,
    IChangeInstanceStatusPayload,
    IEditFailureInstancePayload,
    IOnDetailsViewOpenPayload,
    IRemoveFailureInstancePayload,
    ISelectTestStepPayload,
    IToggleActionPayload,
    IUpdateVisibilityPayload,
} from './action-payloads';
import { AssessmentActions } from './assessment-actions';


const AssessmentMessages = Messages.Assessment;

export class AssessmentActionCreator {
    private assessmentActions: AssessmentActions;
    private registerTypeToPayloadCallback: IRegisterTypeToPayloadCallback;
    private telemetryEventHandler: TelemetryEventHandler;

    constructor(
        assessmentActions: AssessmentActions,
        telemetryEventHandler: TelemetryEventHandler,
        registerTypeToPayloadCallback: IRegisterTypeToPayloadCallback,
    ) {
        this.assessmentActions = assessmentActions;
        this.telemetryEventHandler = telemetryEventHandler;
        this.registerTypeToPayloadCallback = registerTypeToPayloadCallback;
    }

    public registerCallbacks(): void {
        this.registerTypeToPayloadCallback(AssessmentMessages.SelectTestStep, this.onSelectTestStep);
        this.registerTypeToPayloadCallback(AssessmentMessages.GetCurrentState, this.onGetAssessmentCurrentState);
        this.registerTypeToPayloadCallback(AssessmentMessages.AssessmentScanCompleted, this.onAssessmentScanCompleted);
        this.registerTypeToPayloadCallback(AssessmentMessages.StartOver, this.onStartOverAssessment);
        this.registerTypeToPayloadCallback(AssessmentMessages.StartOverAllAssessments, this.onStartOverAllAssessments);
        this.registerTypeToPayloadCallback(AssessmentMessages.ChangeStatus, this.onChangeAssessmentInstanceStatus);
        this.registerTypeToPayloadCallback(AssessmentMessages.ChangeVisualizationState, this.onChangeAssessmentVisualizationState);
        this.registerTypeToPayloadCallback(AssessmentMessages.ChangeVisualizationStateForAll, this.onChangeVisualizationStateForAll);
        this.registerTypeToPayloadCallback(AssessmentMessages.Undo, this.onUndoAssessmentInstanceStatusChange);
        this.registerTypeToPayloadCallback(AssessmentMessages.ChangeStepStatus, this.onChangeManualTestStepStatus);
        this.registerTypeToPayloadCallback(AssessmentMessages.UndoChangeStepStatus, this.onUndoChangeManualTestStepStatus);
        this.registerTypeToPayloadCallback(AssessmentMessages.AddFailureInstance, this.onAddFailureInstance);
        this.registerTypeToPayloadCallback(AssessmentMessages.RemoveFailureInstance, this.onRemoveFailureInstance);
        this.registerTypeToPayloadCallback(AssessmentMessages.EditFailureInstance, this.onEditFailureInstance);
        this.registerTypeToPayloadCallback(AssessmentMessages.UpdateInstanceVisibility, this.onUpdateInstanceVisibility);
        this.registerTypeToPayloadCallback(AssessmentMessages.PassUnmarkedInstances, this.onPassUnmarkedInstances);
        this.registerTypeToPayloadCallback(AssessmentMessages.ScanUpdate, this.onScanUpdate);
        this.registerTypeToPayloadCallback(AssessmentMessages.TrackingCompleted, this.onTrackingCompleted);
        this.registerTypeToPayloadCallback(AssessmentMessages.ContinuePreviousAssessment, this.onContinuePreviousAssessment);
        this.registerTypeToPayloadCallback(Messages.Visualizations.DetailsView.Select, this.onPivotChildSelected);
    }

    @autobind
    private onContinuePreviousAssessment(payload: any, tabId: number): void {
        const eventName = TelemetryEvents.CONTINUE_PREVIOUS_ASSESSMENT;
        this.telemetryEventHandler.publishTelemetry(eventName, payload, tabId);
        this.assessmentActions.continuePreviousAssessment.invoke(tabId);
    }

    @autobind
    private onPassUnmarkedInstances(payload: IToggleActionPayload, tabId: number): void {
        const eventName = TelemetryEvents.PASS_UNMARKED_INSTANCES;
        this.telemetryEventHandler.publishTelemetry(eventName, payload, tabId);
        this.assessmentActions.updateTargetTabId.invoke(tabId);
        this.assessmentActions.passUnmarkedInstance.invoke(payload);
    }

    @autobind
    private onEditFailureInstance(payload: IEditFailureInstancePayload, tabId: number): void {
        const eventName = TelemetryEvents.EDIT_FAILURE_INSTANCE;
        this.telemetryEventHandler.publishTelemetry(eventName, payload, tabId);
        this.assessmentActions.editFailureInstance.invoke(payload);
    }

    @autobind
    private onRemoveFailureInstance(payload: IRemoveFailureInstancePayload, tabId: number): void {
        const eventName = TelemetryEvents.REMOVE_FAILURE_INSTANCE;
        this.telemetryEventHandler.publishTelemetry(eventName, payload, tabId);
        this.assessmentActions.removeFailureInstance.invoke(payload);
    }

    @autobind
    private onAddFailureInstance(payload: IAddFailureInstancePayload, tabId: number): void {
        const eventName = TelemetryEvents.ADD_FAILURE_INSTANCE;
        this.telemetryEventHandler.publishTelemetry(eventName, payload, tabId);
        this.assessmentActions.addFailureInstance.invoke(payload);
    }

    @autobind
    private onChangeManualTestStepStatus(payload: IChangeAssessmentStepStatusPayload, tabId: number): void {
        const eventName = TelemetryEvents.CHANGE_INSTANCE_STATUS;
        this.telemetryEventHandler.publishTelemetry(eventName, payload, tabId);
        this.assessmentActions.updateTargetTabId.invoke(tabId);
        this.assessmentActions.changeStepStatus.invoke(payload);
    }

    @autobind
    private onUndoChangeManualTestStepStatus(payload: IChangeAssessmentStepStatusPayload, tabId: number): void {
        const eventName = TelemetryEvents.UNDO_ASSESSMENT_STEP_STATUS_CHANGE;
        this.telemetryEventHandler.publishTelemetry(eventName, payload, tabId);
        this.assessmentActions.undoStepStatusChange.invoke(payload);
    }

    @autobind
    private onUndoAssessmentInstanceStatusChange(payload: IAssessmentActionInstancePayload, tabId: number): void {
        const eventName = TelemetryEvents.UNDO_ASSESSMENT_STATUS_CHANGE;
        this.telemetryEventHandler.publishTelemetry(eventName, payload, tabId);
        this.assessmentActions.undoInstanceStatusChange.invoke(payload);
    }

    @autobind
    private onChangeAssessmentInstanceStatus(payload: IChangeInstanceStatusPayload, tabId: number): void {
        const eventName = TelemetryEvents.CHANGE_INSTANCE_STATUS;
        this.telemetryEventHandler.publishTelemetry(eventName, payload, tabId);
        this.assessmentActions.updateTargetTabId.invoke(tabId);
        this.assessmentActions.changeInstanceStatus.invoke(payload);
    }

    @autobind
    private onChangeAssessmentVisualizationState(payload: IChangeInstanceSelectionPayload, tabId: number): void {
        const eventName = TelemetryEvents.CHANGE_ASSESSMENT_VISUALIZATION_STATUS;
        this.telemetryEventHandler.publishTelemetry(eventName, payload, tabId);
        this.assessmentActions.changeAssessmentVisualizationState.invoke(payload);
    }

    @autobind
    private onChangeVisualizationStateForAll(payload: IChangeInstanceSelectionPayload, tabId: number) {
        const eventName = TelemetryEvents.CHANGE_ASSESSMENT_VISUALIZATION_STATUS_FOR_ALL;
        this.telemetryEventHandler.publishTelemetry(eventName, payload, tabId);
        this.assessmentActions.changeAssessmentVisualizationStateForAll.invoke(payload);
    }

    @autobind
    private onStartOverAssessment(payload: IToggleActionPayload, tabId: number): void {
        this.assessmentActions.resetData.invoke(payload);
    }

    @autobind
    private onStartOverAllAssessments(payload: IToggleActionPayload, tabId: number): void {
        this.assessmentActions.resetAllAssessmentsData.invoke(tabId);
    }

    @autobind
    private onUpdateInstanceVisibility(payload: IUpdateVisibilityPayload): void {
        this.assessmentActions.updateInstanceVisibility.invoke(payload);
    }

    @autobind
    private onAssessmentScanCompleted(payload: IScanCompletedPayload<any>, tabId: number): void {
        this.assessmentActions.scanCompleted.invoke(payload);
    }

    @autobind
    private onGetAssessmentCurrentState(tabId: number): void {
        this.assessmentActions.getCurrentState.invoke(null);
    }

    @autobind
    private onSelectTestStep(payload: ISelectTestStepPayload, tabId: number): void {
        this.assessmentActions.selectTestStep.invoke(payload);
        this.telemetryEventHandler.publishTelemetry(TelemetryEvents.SELECT_TEST_STEP, payload, tabId);
    }

    @autobind
    private onScanUpdate(payload: IScanUpdatePayload, tabId: number): void {
        const telemetryEventName = 'ScanUpdate' + payload.key.toTitleCase();
        this.telemetryEventHandler.publishTelemetry(telemetryEventName, payload, tabId);
        this.assessmentActions.scanUpdate.invoke(payload);
    }

    @autobind
    private onTrackingCompleted(payload: IScanBasePayload, tabId: number): void {
        const telemetryEventName = 'TrackingCompleted' + payload.key.toTitleCase();
        this.telemetryEventHandler.publishTelemetry(telemetryEventName, payload, tabId);
        this.assessmentActions.trackingCompleted.invoke(payload);
    }

    @autobind
    private onPivotChildSelected(payload: IOnDetailsViewOpenPayload, tabId: number): void {
        this.assessmentActions.updateSelectedPivotChild.invoke(payload);
    }
}
