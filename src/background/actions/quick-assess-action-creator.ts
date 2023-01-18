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
} from './action-payloads';
import { AssessmentActions } from './assessment-actions';

const QuickAssessMessages = Messages.QuickAssess;

export class QuickAssessActionCreator {
    // This is to be used as the scope parameter to invoke().
    // Some callbacks in this class are registered to messages with
    // multiple callbacks (see the comment in src/common/flux/scope-mutex.ts)
    private readonly executingScope = 'QuickAssessActionCreator';

    constructor(
        private readonly interpreter: Interpreter,
        private readonly quickAssessActions: AssessmentActions,
        private readonly telemetryEventHandler: TelemetryEventHandler,
    ) {}

    public registerCallbacks(): void {
        this.interpreter.registerTypeToPayloadCallback(
            QuickAssessMessages.SelectTestRequirement,
            this.onSelectTestRequirement,
        );
        this.interpreter.registerTypeToPayloadCallback(
            QuickAssessMessages.SelectNextRequirement,
            this.onSelectNextTestRequirement,
        );
        this.interpreter.registerTypeToPayloadCallback(
            QuickAssessMessages.SelectGettingStarted,
            this.onSelectGettingStarted,
        );
        this.interpreter.registerTypeToPayloadCallback(
            QuickAssessMessages.ExpandTestNav,
            this.onExpandTestNav,
        );
        this.interpreter.registerTypeToPayloadCallback(
            QuickAssessMessages.CollapseTestNav,
            this.onCollapseTestNav,
        );
        this.interpreter.registerTypeToPayloadCallback(
            getStoreStateMessage(StoreNames.QuickAssessStore),
            this.onGetAssessmentCurrentState,
        );
        this.interpreter.registerTypeToPayloadCallback(
            QuickAssessMessages.AssessmentScanCompleted,
            this.onAssessmentScanCompleted,
        );
        this.interpreter.registerTypeToPayloadCallback(
            QuickAssessMessages.StartOverTest,
            this.onStartOverAssessment,
        );
        this.interpreter.registerTypeToPayloadCallback(
            QuickAssessMessages.StartOverAllAssessments,
            this.onStartOverAllAssessments,
        );
        this.interpreter.registerTypeToPayloadCallback(
            QuickAssessMessages.ChangeStatus,
            this.onChangeAssessmentInstanceStatus,
        );
        this.interpreter.registerTypeToPayloadCallback(
            QuickAssessMessages.ChangeVisualizationState,
            this.onChangeAssessmentVisualizationState,
        );
        this.interpreter.registerTypeToPayloadCallback(
            QuickAssessMessages.ChangeVisualizationStateForAll,
            this.onChangeVisualizationStateForAll,
        );
        this.interpreter.registerTypeToPayloadCallback(
            QuickAssessMessages.Undo,
            this.onUndoAssessmentInstanceStatusChange,
        );
        this.interpreter.registerTypeToPayloadCallback(
            QuickAssessMessages.ChangeRequirementStatus,
            this.onChangeManualRequirementStatus,
        );
        this.interpreter.registerTypeToPayloadCallback(
            QuickAssessMessages.UndoChangeRequirementStatus,
            this.onUndoChangeManualRequirementStatus,
        );
        this.interpreter.registerTypeToPayloadCallback(
            QuickAssessMessages.AddFailureInstance,
            this.onAddFailureInstance,
        );
        this.interpreter.registerTypeToPayloadCallback(
            QuickAssessMessages.AddResultDescription,
            this.onAddResultDescription,
        );
        this.interpreter.registerTypeToPayloadCallback(
            QuickAssessMessages.RemoveFailureInstance,
            this.onRemoveFailureInstance,
        );
        this.interpreter.registerTypeToPayloadCallback(
            QuickAssessMessages.EditFailureInstance,
            this.onEditFailureInstance,
        );
        this.interpreter.registerTypeToPayloadCallback(
            QuickAssessMessages.PassUnmarkedInstances,
            this.onPassUnmarkedInstances,
        );
        this.interpreter.registerTypeToPayloadCallback(
            QuickAssessMessages.ScanUpdate,
            this.onScanUpdate,
        );
        this.interpreter.registerTypeToPayloadCallback(
            QuickAssessMessages.TrackingCompleted,
            this.onTrackingCompleted,
        );
        this.interpreter.registerTypeToPayloadCallback(
            QuickAssessMessages.ContinuePreviousAssessment,
            this.onContinuePreviousAssessment,
        );
        this.interpreter.registerTypeToPayloadCallback(
            Messages.Visualizations.DetailsView.Select,
            this.onPivotChildSelected,
        );
    }

    private onContinuePreviousAssessment = async (
        payload: BaseActionPayload,
        tabId: number,
    ): Promise<void> => {
        const eventName = TelemetryEvents.CONTINUE_PREVIOUS_QUICK_ASSESS;
        this.telemetryEventHandler.publishTelemetry(eventName, payload);
        await this.quickAssessActions.continuePreviousAssessment.invoke(tabId, this.executingScope);
    };

    private onPassUnmarkedInstances = async (
        payload: ToggleActionPayload,
        tabId: number,
    ): Promise<void> => {
        const eventName = TelemetryEvents.PASS_UNMARKED_INSTANCES;
        this.telemetryEventHandler.publishTelemetry(eventName, payload);
        await this.quickAssessActions.updateTargetTabId.invoke(tabId, this.executingScope);
        await this.quickAssessActions.passUnmarkedInstance.invoke(payload, this.executingScope);
    };

    private onEditFailureInstance = async (payload: EditFailureInstancePayload): Promise<void> => {
        const eventName = TelemetryEvents.EDIT_FAILURE_INSTANCE;
        this.telemetryEventHandler.publishTelemetry(eventName, payload);
        await this.quickAssessActions.editFailureInstance.invoke(payload, this.executingScope);
    };

    private onRemoveFailureInstance = async (
        payload: RemoveFailureInstancePayload,
    ): Promise<void> => {
        const eventName = TelemetryEvents.REMOVE_FAILURE_INSTANCE;
        this.telemetryEventHandler.publishTelemetry(eventName, payload);
        await this.quickAssessActions.removeFailureInstance.invoke(payload, this.executingScope);
    };

    private onAddFailureInstance = async (payload: AddFailureInstancePayload): Promise<void> => {
        const eventName = TelemetryEvents.ADD_FAILURE_INSTANCE;
        this.telemetryEventHandler.publishTelemetry(eventName, payload);
        await this.quickAssessActions.addFailureInstance.invoke(payload, this.executingScope);
    };

    private onAddResultDescription = async (
        payload: AddResultDescriptionPayload,
    ): Promise<void> => {
        await this.quickAssessActions.addResultDescription.invoke(payload, this.executingScope);
    };

    private onChangeManualRequirementStatus = async (
        payload: ChangeRequirementStatusPayload,
        tabId: number,
    ): Promise<void> => {
        const eventName = TelemetryEvents.CHANGE_INSTANCE_STATUS;
        this.telemetryEventHandler.publishTelemetry(eventName, payload);
        await this.quickAssessActions.updateTargetTabId.invoke(tabId, this.executingScope);
        await this.quickAssessActions.changeRequirementStatus.invoke(payload, this.executingScope);
    };

    private onUndoChangeManualRequirementStatus = async (
        payload: ChangeRequirementStatusPayload,
    ): Promise<void> => {
        const eventName = TelemetryEvents.UNDO_REQUIREMENT_STATUS_CHANGE;
        this.telemetryEventHandler.publishTelemetry(eventName, payload);
        await this.quickAssessActions.undoRequirementStatusChange.invoke(
            payload,
            this.executingScope,
        );
    };

    private onUndoAssessmentInstanceStatusChange = async (
        payload: AssessmentActionInstancePayload,
    ): Promise<void> => {
        const eventName = TelemetryEvents.UNDO_TEST_STATUS_CHANGE;
        this.telemetryEventHandler.publishTelemetry(eventName, payload);
        await this.quickAssessActions.undoInstanceStatusChange.invoke(payload, this.executingScope);
    };

    private onChangeAssessmentInstanceStatus = async (
        payload: ChangeInstanceStatusPayload,
        tabId: number,
    ): Promise<void> => {
        const eventName = TelemetryEvents.CHANGE_INSTANCE_STATUS;
        this.telemetryEventHandler.publishTelemetry(eventName, payload);
        await this.quickAssessActions.updateTargetTabId.invoke(tabId, this.executingScope);
        await this.quickAssessActions.changeInstanceStatus.invoke(payload, this.executingScope);
    };

    private onChangeAssessmentVisualizationState = async (
        payload: ChangeInstanceSelectionPayload,
    ): Promise<void> => {
        const eventName = TelemetryEvents.CHANGE_QUICK_ASSESS_VISUALIZATION_STATUS;
        this.telemetryEventHandler.publishTelemetry(eventName, payload);
        await this.quickAssessActions.changeAssessmentVisualizationState.invoke(
            payload,
            this.executingScope,
        );
    };

    private onChangeVisualizationStateForAll = async (
        payload: ChangeInstanceSelectionPayload,
    ): Promise<void> => {
        const eventName = TelemetryEvents.CHANGE_QUICK_ASSESS_VISUALIZATION_STATUS_FOR_ALL;
        this.telemetryEventHandler.publishTelemetry(eventName, payload);
        await this.quickAssessActions.changeAssessmentVisualizationStateForAll.invoke(
            payload,
            this.executingScope,
        );
    };

    private onStartOverAssessment = async (payload: ToggleActionPayload): Promise<void> => {
        await this.quickAssessActions.resetData.invoke(payload, this.executingScope);
    };

    private onStartOverAllAssessments = async (
        payload: ToggleActionPayload,
        tabId: number,
    ): Promise<void> => {
        await this.quickAssessActions.resetAllAssessmentsData.invoke(tabId, this.executingScope);
    };

    private onAssessmentScanCompleted = async (
        payload: ScanCompletedPayload<any>,
        tabId: number,
    ): Promise<void> => {
        const scope = `${this.executingScope}-${payload.key}`;
        await this.quickAssessActions.updateTargetTabId.invoke(tabId, scope);
        await this.quickAssessActions.scanCompleted.invoke(payload, scope);
    };

    private onGetAssessmentCurrentState = async (): Promise<void> => {
        await this.quickAssessActions.getCurrentState.invoke(null, this.executingScope);
    };

    private onSelectTestRequirement = async (payload: SelectTestSubviewPayload): Promise<void> => {
        await this.quickAssessActions.selectTestSubview.invoke(payload, this.executingScope);
        this.telemetryEventHandler.publishTelemetry(TelemetryEvents.SELECT_REQUIREMENT, payload);
    };

    private onSelectNextTestRequirement = async (
        payload: SelectTestSubviewPayload,
    ): Promise<void> => {
        await this.quickAssessActions.selectTestSubview.invoke(payload, this.executingScope);
        this.telemetryEventHandler.publishTelemetry(
            TelemetryEvents.SELECT_NEXT_REQUIREMENT,
            payload,
        );
    };

    private onSelectGettingStarted = async (
        payload: SelectGettingStartedPayload,
    ): Promise<void> => {
        await this.quickAssessActions.selectTestSubview.invoke(
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
        await this.quickAssessActions.expandTestNav.invoke(payload, this.executingScope);
    };

    private onCollapseTestNav = async (): Promise<void> => {
        await this.quickAssessActions.collapseTestNav.invoke(null, this.executingScope);
    };

    private onScanUpdate = async (payload: ScanUpdatePayload): Promise<void> => {
        const telemetryEventName = 'ScanUpdate' + capitalize(payload.key);
        this.telemetryEventHandler.publishTelemetry(telemetryEventName, payload);
        await this.quickAssessActions.scanUpdate.invoke(payload, this.executingScope);
    };

    private onTrackingCompleted = async (payload: ScanBasePayload): Promise<void> => {
        const telemetryEventName = 'TrackingCompleted' + capitalize(payload.key);
        this.telemetryEventHandler.publishTelemetry(telemetryEventName, payload);
        await this.quickAssessActions.trackingCompleted.invoke(payload, this.executingScope);
    };

    private onPivotChildSelected = async (payload: OnDetailsViewOpenPayload): Promise<void> => {
        await this.quickAssessActions.updateSelectedPivotChild.invoke(payload, this.executingScope);
    };
}
