// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as TelemetryEvents from 'common/extension-telemetry-events';
import { getStoreStateMessage, Messages } from 'common/messages';
import { StoreNames } from 'common/stores/store-names';
import { gettingStartedSubview } from 'common/types/store-data/assessment-result-data';
import {
    ScanBasePayload,
    ScanCompletedPayload,
    ScanUpdatePayload,
} from 'injected/analyzers/analyzer';
import { capitalize } from 'lodash';
import { Interpreter } from '../interpreter';
import { TelemetryEventHandler } from '../telemetry/telemetry-event-handler';
import {
    AddFailureInstancePayload,
    AddResultDescriptionPayload,
    AssessmentActionInstancePayload,
    BaseActionPayload,
    ChangeInstanceSelectionPayload,
    ChangeInstanceStatusPayload,
    ChangeRequirementStatusPayload,
    EditFailureInstancePayload,
    ExpandTestNavPayload,
    OnDetailsViewOpenPayload,
    RemoveFailureInstancePayload,
    SelectGettingStartedPayload,
    SelectTestSubviewPayload,
    ToggleActionPayload,
    LoadAssessmentPayload,
    OnDetailsViewInitializedPayload,
} from './action-payloads';
import { AssessmentActions } from './assessment-actions';

const AssessmentMessages = Messages.Assessment;

export class AssessmentActionCreator {
    // This is to be used as the scope parameter to invoke().
    // Some callbacks in this class are registered to messages with
    // multiple callbacks (see the comment in src/common/flux/scope-mutex.ts)
    private readonly executingScope = 'AssessmentActionCreator';

    constructor(
        private readonly interpreter: Interpreter,
        private readonly assessmentActions: AssessmentActions,
        private readonly telemetryEventHandler: TelemetryEventHandler,
    ) {}

    public registerCallbacks(): void {
        this.interpreter.registerTypeToPayloadCallback(
            AssessmentMessages.SelectTestRequirement,
            this.onSelectTestRequirement,
        );
        this.interpreter.registerTypeToPayloadCallback(
            AssessmentMessages.SelectNextRequirement,
            this.onSelectNextTestRequirement,
        );
        this.interpreter.registerTypeToPayloadCallback(
            AssessmentMessages.SelectGettingStarted,
            this.onSelectGettingStarted,
        );
        this.interpreter.registerTypeToPayloadCallback(
            AssessmentMessages.ExpandTestNav,
            this.onExpandTestNav,
        );
        this.interpreter.registerTypeToPayloadCallback(
            AssessmentMessages.CollapseTestNav,
            this.onCollapseTestNav,
        );
        this.interpreter.registerTypeToPayloadCallback(
            getStoreStateMessage(StoreNames.AssessmentStore),
            this.onGetAssessmentCurrentState,
        );
        this.interpreter.registerTypeToPayloadCallback(
            AssessmentMessages.AssessmentScanCompleted,
            this.onAssessmentScanCompleted,
        );
        this.interpreter.registerTypeToPayloadCallback(
            AssessmentMessages.StartOverTest,
            this.onStartOverAssessment,
        );
        this.interpreter.registerTypeToPayloadCallback(
            AssessmentMessages.StartOverAllAssessments,
            this.onStartOverAllAssessments,
        );
        this.interpreter.registerTypeToPayloadCallback(
            AssessmentMessages.ChangeStatus,
            this.onChangeAssessmentInstanceStatus,
        );
        this.interpreter.registerTypeToPayloadCallback(
            AssessmentMessages.ChangeVisualizationState,
            this.onChangeAssessmentVisualizationState,
        );
        this.interpreter.registerTypeToPayloadCallback(
            AssessmentMessages.ChangeVisualizationStateForAll,
            this.onChangeVisualizationStateForAll,
        );
        this.interpreter.registerTypeToPayloadCallback(
            AssessmentMessages.Undo,
            this.onUndoAssessmentInstanceStatusChange,
        );
        this.interpreter.registerTypeToPayloadCallback(
            AssessmentMessages.ChangeRequirementStatus,
            this.onChangeManualRequirementStatus,
        );
        this.interpreter.registerTypeToPayloadCallback(
            AssessmentMessages.UndoChangeRequirementStatus,
            this.onUndoChangeManualRequirementStatus,
        );
        this.interpreter.registerTypeToPayloadCallback(
            AssessmentMessages.AddFailureInstance,
            this.onAddFailureInstance,
        );
        this.interpreter.registerTypeToPayloadCallback(
            AssessmentMessages.AddResultDescription,
            this.onAddResultDescription,
        );
        this.interpreter.registerTypeToPayloadCallback(
            AssessmentMessages.RemoveFailureInstance,
            this.onRemoveFailureInstance,
        );
        this.interpreter.registerTypeToPayloadCallback(
            AssessmentMessages.EditFailureInstance,
            this.onEditFailureInstance,
        );
        this.interpreter.registerTypeToPayloadCallback(
            AssessmentMessages.PassUnmarkedInstances,
            this.onPassUnmarkedInstances,
        );
        this.interpreter.registerTypeToPayloadCallback(
            AssessmentMessages.ScanUpdate,
            this.onScanUpdate,
        );
        this.interpreter.registerTypeToPayloadCallback(
            AssessmentMessages.TrackingCompleted,
            this.onTrackingCompleted,
        );
        this.interpreter.registerTypeToPayloadCallback(
            AssessmentMessages.ContinuePreviousAssessment,
            this.onContinuePreviousAssessment,
        );
        this.interpreter.registerTypeToPayloadCallback(
            AssessmentMessages.LoadAssessment,
            this.onLoadAssessment,
        );
        this.interpreter.registerTypeToPayloadCallback(
            Messages.Visualizations.DetailsView.Select,
            this.onPivotChildSelected,
        );
        this.interpreter.registerTypeToPayloadCallback(
            Messages.Visualizations.DetailsView.Initialize,
            this.onDetailsViewInitialized,
        );
        this.interpreter.registerTypeToPayloadCallback(
            AssessmentMessages.Initialize,
            this.onDetailsViewInitialized,
        );
        this.interpreter.registerTypeToPayloadCallback(
            AssessmentMessages.SaveAssessment,
            this.onSaveAssessment,
        );
    }

    private onContinuePreviousAssessment = async (
        payload: BaseActionPayload,
        tabId: number,
    ): Promise<void> => {
        const eventName = TelemetryEvents.CONTINUE_PREVIOUS_ASSESSMENT;
        this.telemetryEventHandler.publishTelemetry(eventName, payload);
        await this.assessmentActions.continuePreviousAssessment.invoke(tabId, this.executingScope);
    };

    private onLoadAssessment = async (
        payload: LoadAssessmentPayload,
        tabId: number,
    ): Promise<void> => {
        const eventName = TelemetryEvents.LOAD_ASSESSMENT;
        this.telemetryEventHandler.publishTelemetry(eventName, payload);
        await this.assessmentActions.loadAssessment.invoke(payload, this.executingScope);
    };

    private onSaveAssessment = (payload: BaseActionPayload): void => {
        const eventName = TelemetryEvents.SAVE_ASSESSMENT;
        this.telemetryEventHandler.publishTelemetry(eventName, payload);
    };

    private onPassUnmarkedInstances = async (
        payload: ToggleActionPayload,
        tabId: number,
    ): Promise<void> => {
        const eventName = TelemetryEvents.PASS_UNMARKED_INSTANCES;
        this.telemetryEventHandler.publishTelemetry(eventName, payload);
        await this.assessmentActions.updateTargetTabId.invoke(tabId, this.executingScope);
        await this.assessmentActions.passUnmarkedInstance.invoke(payload, this.executingScope);
    };

    private onEditFailureInstance = async (payload: EditFailureInstancePayload): Promise<void> => {
        const eventName = TelemetryEvents.EDIT_FAILURE_INSTANCE;
        this.telemetryEventHandler.publishTelemetry(eventName, payload);
        await this.assessmentActions.editFailureInstance.invoke(payload, this.executingScope);
    };

    private onRemoveFailureInstance = async (
        payload: RemoveFailureInstancePayload,
    ): Promise<void> => {
        const eventName = TelemetryEvents.REMOVE_FAILURE_INSTANCE;
        this.telemetryEventHandler.publishTelemetry(eventName, payload);
        await this.assessmentActions.removeFailureInstance.invoke(payload, this.executingScope);
    };

    private onAddFailureInstance = async (payload: AddFailureInstancePayload): Promise<void> => {
        const eventName = TelemetryEvents.ADD_FAILURE_INSTANCE;
        this.telemetryEventHandler.publishTelemetry(eventName, payload);
        await this.assessmentActions.addFailureInstance.invoke(payload, this.executingScope);
    };

    private onAddResultDescription = async (
        payload: AddResultDescriptionPayload,
    ): Promise<void> => {
        await this.assessmentActions.addResultDescription.invoke(payload, this.executingScope);
    };

    private onChangeManualRequirementStatus = async (
        payload: ChangeRequirementStatusPayload,
        tabId: number,
    ): Promise<void> => {
        const eventName = TelemetryEvents.CHANGE_INSTANCE_STATUS;
        this.telemetryEventHandler.publishTelemetry(eventName, payload);
        await this.assessmentActions.updateTargetTabId.invoke(tabId, this.executingScope);
        await this.assessmentActions.changeRequirementStatus.invoke(payload, this.executingScope);
    };

    private onUndoChangeManualRequirementStatus = async (
        payload: ChangeRequirementStatusPayload,
    ): Promise<void> => {
        const eventName = TelemetryEvents.UNDO_REQUIREMENT_STATUS_CHANGE;
        this.telemetryEventHandler.publishTelemetry(eventName, payload);
        await this.assessmentActions.undoRequirementStatusChange.invoke(
            payload,
            this.executingScope,
        );
    };

    private onUndoAssessmentInstanceStatusChange = async (
        payload: AssessmentActionInstancePayload,
    ): Promise<void> => {
        const eventName = TelemetryEvents.UNDO_TEST_STATUS_CHANGE;
        this.telemetryEventHandler.publishTelemetry(eventName, payload);
        await this.assessmentActions.undoInstanceStatusChange.invoke(payload, this.executingScope);
    };

    private onChangeAssessmentInstanceStatus = async (
        payload: ChangeInstanceStatusPayload,
        tabId: number,
    ): Promise<void> => {
        const eventName = TelemetryEvents.CHANGE_INSTANCE_STATUS;
        this.telemetryEventHandler.publishTelemetry(eventName, payload);
        await this.assessmentActions.updateTargetTabId.invoke(tabId, this.executingScope);
        await this.assessmentActions.changeInstanceStatus.invoke(payload, this.executingScope);
    };

    private onChangeAssessmentVisualizationState = async (
        payload: ChangeInstanceSelectionPayload,
    ): Promise<void> => {
        const eventName = TelemetryEvents.CHANGE_ASSESSMENT_VISUALIZATION_STATUS;
        this.telemetryEventHandler.publishTelemetry(eventName, payload);
        await this.assessmentActions.changeAssessmentVisualizationState.invoke(
            payload,
            this.executingScope,
        );
    };

    private onChangeVisualizationStateForAll = async (
        payload: ChangeInstanceSelectionPayload,
    ): Promise<void> => {
        const eventName = TelemetryEvents.CHANGE_ASSESSMENT_VISUALIZATION_STATUS_FOR_ALL;
        this.telemetryEventHandler.publishTelemetry(eventName, payload);
        await this.assessmentActions.changeAssessmentVisualizationStateForAll.invoke(
            payload,
            this.executingScope,
        );
    };

    private onStartOverAssessment = async (payload: ToggleActionPayload): Promise<void> => {
        await this.assessmentActions.resetData.invoke(payload, this.executingScope);
    };

    private onStartOverAllAssessments = async (
        payload: ToggleActionPayload,
        tabId: number,
    ): Promise<void> => {
        await this.assessmentActions.resetAllAssessmentsData.invoke(tabId, this.executingScope);
    };

    private onAssessmentScanCompleted = async (
        payload: ScanCompletedPayload<any>,
        tabId: number,
    ): Promise<void> => {
        const scope = `${this.executingScope}-${payload.key}`;
        await this.assessmentActions.updateTargetTabId.invoke(tabId, scope);
        await this.assessmentActions.scanCompleted.invoke(payload, scope);
    };

    private onGetAssessmentCurrentState = async (): Promise<void> => {
        await this.assessmentActions.getCurrentState.invoke(null, this.executingScope);
    };

    private onSelectTestRequirement = async (payload: SelectTestSubviewPayload): Promise<void> => {
        await this.assessmentActions.selectTestSubview.invoke(payload, this.executingScope);
        this.telemetryEventHandler.publishTelemetry(TelemetryEvents.SELECT_REQUIREMENT, payload);
    };

    private onSelectNextTestRequirement = async (
        payload: SelectTestSubviewPayload,
    ): Promise<void> => {
        await this.assessmentActions.selectTestSubview.invoke(payload, this.executingScope);
        this.telemetryEventHandler.publishTelemetry(
            TelemetryEvents.SELECT_NEXT_REQUIREMENT,
            payload,
        );
    };

    private onSelectGettingStarted = async (
        payload: SelectGettingStartedPayload,
    ): Promise<void> => {
        await this.assessmentActions.selectTestSubview.invoke(
            {
                selectedTestSubview: gettingStartedSubview,
                ...payload,
            },
            this.executingScope,
        );
        this.telemetryEventHandler.publishTelemetry(
            TelemetryEvents.SELECT_GETTING_STARTED,
            payload,
        );
    };

    private onExpandTestNav = async (payload: ExpandTestNavPayload): Promise<void> => {
        await this.assessmentActions.expandTestNav.invoke(payload, this.executingScope);
    };

    private onCollapseTestNav = async (): Promise<void> => {
        await this.assessmentActions.collapseTestNav.invoke(null, this.executingScope);
    };

    private onScanUpdate = async (payload: ScanUpdatePayload): Promise<void> => {
        const telemetryEventName = 'ScanUpdate' + capitalize(payload.key);
        this.telemetryEventHandler.publishTelemetry(telemetryEventName, payload);
        await this.assessmentActions.scanUpdate.invoke(payload, this.executingScope);
    };

    private onTrackingCompleted = async (payload: ScanBasePayload): Promise<void> => {
        const telemetryEventName = 'TrackingCompleted' + capitalize(payload.key);
        this.telemetryEventHandler.publishTelemetry(telemetryEventName, payload);
        await this.assessmentActions.trackingCompleted.invoke(payload, this.executingScope);
    };

    private onPivotChildSelected = async (payload: OnDetailsViewOpenPayload): Promise<void> => {
        await this.assessmentActions.updateSelectedPivotChild.invoke(payload, this.executingScope);
    };

    private onDetailsViewInitialized = async (
        payload: OnDetailsViewInitializedPayload,
    ): Promise<void> => {
        await this.assessmentActions.updateDetailsViewId.invoke(payload, this.executingScope);
    };
}
