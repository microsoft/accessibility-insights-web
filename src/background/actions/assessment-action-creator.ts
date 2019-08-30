// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { capitalize } from 'lodash';
import { RegisterTypeToPayloadCallback } from '../../common/message';
import { getStoreStateMessage, Messages } from '../../common/messages';
import { StoreNames } from '../../common/stores/store-names';
import * as TelemetryEvents from '../../common/telemetry-events';
import { ScanBasePayload, ScanCompletedPayload, ScanUpdatePayload } from '../../injected/analyzers/analyzer';
import { TelemetryEventHandler } from '../telemetry/telemetry-event-handler';
import {
    AddFailureInstancePayload,
    AddResultDescriptionPayload,
    AssessmentActionInstancePayload,
    ChangeInstanceSelectionPayload,
    ChangeInstanceStatusPayload,
    ChangeRequirementStatusPayload,
    EditFailureInstancePayload,
    OnDetailsViewOpenPayload,
    RemoveFailureInstancePayload,
    SelectRequirementPayload,
    ToggleActionPayload,
    UpdateVisibilityPayload,
} from './action-payloads';
import { AssessmentActions } from './assessment-actions';

const AssessmentMessages = Messages.Assessment;

export class AssessmentActionCreator {
    private assessmentActions: AssessmentActions;
    private registerTypeToPayloadCallback: RegisterTypeToPayloadCallback;
    private telemetryEventHandler: TelemetryEventHandler;

    constructor(
        assessmentActions: AssessmentActions,
        telemetryEventHandler: TelemetryEventHandler,
        registerTypeToPayloadCallback: RegisterTypeToPayloadCallback,
    ) {
        this.assessmentActions = assessmentActions;
        this.telemetryEventHandler = telemetryEventHandler;
        this.registerTypeToPayloadCallback = registerTypeToPayloadCallback;
    }

    public registerCallbacks(): void {
        this.registerTypeToPayloadCallback(AssessmentMessages.SelectTestRequirement, this.onSelectTestStep);
        this.registerTypeToPayloadCallback(getStoreStateMessage(StoreNames.AssessmentStore), this.onGetAssessmentCurrentState);
        this.registerTypeToPayloadCallback(AssessmentMessages.AssessmentScanCompleted, this.onAssessmentScanCompleted);
        this.registerTypeToPayloadCallback(AssessmentMessages.StartOver, this.onStartOverAssessment);
        this.registerTypeToPayloadCallback(AssessmentMessages.StartOverAllAssessments, this.onStartOverAllAssessments);
        this.registerTypeToPayloadCallback(AssessmentMessages.ChangeStatus, this.onChangeAssessmentInstanceStatus);
        this.registerTypeToPayloadCallback(AssessmentMessages.ChangeVisualizationState, this.onChangeAssessmentVisualizationState);
        this.registerTypeToPayloadCallback(AssessmentMessages.ChangeVisualizationStateForAll, this.onChangeVisualizationStateForAll);
        this.registerTypeToPayloadCallback(AssessmentMessages.Undo, this.onUndoAssessmentInstanceStatusChange);
        this.registerTypeToPayloadCallback(AssessmentMessages.ChangeRequirementStatus, this.onChangeManualRequirementStatus);
        this.registerTypeToPayloadCallback(AssessmentMessages.UndoChangeRequirementStatus, this.onUndoChangeManualRequirementStatus);
        this.registerTypeToPayloadCallback(AssessmentMessages.AddFailureInstance, this.onAddFailureInstance);
        this.registerTypeToPayloadCallback(AssessmentMessages.AddResultDescription, this.onAddResultDescription);
        this.registerTypeToPayloadCallback(AssessmentMessages.RemoveFailureInstance, this.onRemoveFailureInstance);
        this.registerTypeToPayloadCallback(AssessmentMessages.EditFailureInstance, this.onEditFailureInstance);
        this.registerTypeToPayloadCallback(AssessmentMessages.UpdateInstanceVisibility, this.onUpdateInstanceVisibility);
        this.registerTypeToPayloadCallback(AssessmentMessages.PassUnmarkedInstances, this.onPassUnmarkedInstances);
        this.registerTypeToPayloadCallback(AssessmentMessages.ScanUpdate, this.onScanUpdate);
        this.registerTypeToPayloadCallback(AssessmentMessages.TrackingCompleted, this.onTrackingCompleted);
        this.registerTypeToPayloadCallback(AssessmentMessages.ContinuePreviousAssessment, this.onContinuePreviousAssessment);
        this.registerTypeToPayloadCallback(Messages.Visualizations.DetailsView.Select, this.onPivotChildSelected);
    }

    private onContinuePreviousAssessment = (payload: any, tabId: number): void => {
        const eventName = TelemetryEvents.CONTINUE_PREVIOUS_ASSESSMENT;
        this.telemetryEventHandler.publishTelemetry(eventName, payload);
        this.assessmentActions.continuePreviousAssessment.invoke(tabId);
    };

    private onPassUnmarkedInstances = (payload: ToggleActionPayload, tabId: number): void => {
        const eventName = TelemetryEvents.PASS_UNMARKED_INSTANCES;
        this.telemetryEventHandler.publishTelemetry(eventName, payload);
        this.assessmentActions.updateTargetTabId.invoke(tabId);
        this.assessmentActions.passUnmarkedInstance.invoke(payload);
    };

    private onEditFailureInstance = (payload: EditFailureInstancePayload): void => {
        const eventName = TelemetryEvents.EDIT_FAILURE_INSTANCE;
        this.telemetryEventHandler.publishTelemetry(eventName, payload);
        this.assessmentActions.editFailureInstance.invoke(payload);
    };

    private onRemoveFailureInstance = (payload: RemoveFailureInstancePayload): void => {
        const eventName = TelemetryEvents.REMOVE_FAILURE_INSTANCE;
        this.telemetryEventHandler.publishTelemetry(eventName, payload);
        this.assessmentActions.removeFailureInstance.invoke(payload);
    };

    private onAddFailureInstance = (payload: AddFailureInstancePayload): void => {
        const eventName = TelemetryEvents.ADD_FAILURE_INSTANCE;
        this.telemetryEventHandler.publishTelemetry(eventName, payload);
        this.assessmentActions.addFailureInstance.invoke(payload);
    };

    private onAddResultDescription = (payload: AddResultDescriptionPayload): void => {
        this.assessmentActions.addResultDescription.invoke(payload);
    };

    private onChangeManualRequirementStatus = (payload: ChangeRequirementStatusPayload, tabId: number): void => {
        const eventName = TelemetryEvents.CHANGE_INSTANCE_STATUS;
        this.telemetryEventHandler.publishTelemetry(eventName, payload);
        this.assessmentActions.updateTargetTabId.invoke(tabId);
        this.assessmentActions.changeRequirementStatus.invoke(payload);
    };

    private onUndoChangeManualRequirementStatus = (payload: ChangeRequirementStatusPayload): void => {
        const eventName = TelemetryEvents.UNDO_REQUIREMENT_STATUS_CHANGE;
        this.telemetryEventHandler.publishTelemetry(eventName, payload);
        this.assessmentActions.undoRequirementStatusChange.invoke(payload);
    };

    private onUndoAssessmentInstanceStatusChange = (payload: AssessmentActionInstancePayload): void => {
        const eventName = TelemetryEvents.UNDO_TEST_STATUS_CHANGE;
        this.telemetryEventHandler.publishTelemetry(eventName, payload);
        this.assessmentActions.undoInstanceStatusChange.invoke(payload);
    };

    private onChangeAssessmentInstanceStatus = (payload: ChangeInstanceStatusPayload, tabId: number): void => {
        const eventName = TelemetryEvents.CHANGE_INSTANCE_STATUS;
        this.telemetryEventHandler.publishTelemetry(eventName, payload);
        this.assessmentActions.updateTargetTabId.invoke(tabId);
        this.assessmentActions.changeInstanceStatus.invoke(payload);
    };

    private onChangeAssessmentVisualizationState = (payload: ChangeInstanceSelectionPayload): void => {
        const eventName = TelemetryEvents.CHANGE_ASSESSMENT_VISUALIZATION_STATUS;
        this.telemetryEventHandler.publishTelemetry(eventName, payload);
        this.assessmentActions.changeAssessmentVisualizationState.invoke(payload);
    };

    private onChangeVisualizationStateForAll = (payload: ChangeInstanceSelectionPayload): void => {
        const eventName = TelemetryEvents.CHANGE_ASSESSMENT_VISUALIZATION_STATUS_FOR_ALL;
        this.telemetryEventHandler.publishTelemetry(eventName, payload);
        this.assessmentActions.changeAssessmentVisualizationStateForAll.invoke(payload);
    };

    private onStartOverAssessment = (payload: ToggleActionPayload): void => {
        this.assessmentActions.resetData.invoke(payload);
    };

    private onStartOverAllAssessments = (payload: ToggleActionPayload, tabId: number): void => {
        this.assessmentActions.resetAllAssessmentsData.invoke(tabId);
    };

    private onUpdateInstanceVisibility = (payload: UpdateVisibilityPayload): void => {
        this.assessmentActions.updateInstanceVisibility.invoke(payload);
    };

    private onAssessmentScanCompleted = (payload: ScanCompletedPayload<any>, tabId: number): void => {
        this.assessmentActions.updateTargetTabId.invoke(tabId);
        this.assessmentActions.scanCompleted.invoke(payload);
    };

    private onGetAssessmentCurrentState = (): void => {
        this.assessmentActions.getCurrentState.invoke(null);
    };

    private onSelectTestStep = (payload: SelectRequirementPayload): void => {
        this.assessmentActions.selectRequirement.invoke(payload);
        this.telemetryEventHandler.publishTelemetry(TelemetryEvents.SELECT_REQUIREMENT, payload);
    };

    private onScanUpdate = (payload: ScanUpdatePayload): void => {
        const telemetryEventName = 'ScanUpdate' + capitalize(payload.key);
        this.telemetryEventHandler.publishTelemetry(telemetryEventName, payload);
        this.assessmentActions.scanUpdate.invoke(payload);
    };

    private onTrackingCompleted = (payload: ScanBasePayload): void => {
        const telemetryEventName = 'TrackingCompleted' + capitalize(payload.key);
        this.telemetryEventHandler.publishTelemetry(telemetryEventName, payload);
        this.assessmentActions.trackingCompleted.invoke(payload);
    };

    private onPivotChildSelected = (payload: OnDetailsViewOpenPayload): void => {
        this.assessmentActions.updateSelectedPivotChild.invoke(payload);
    };
}
