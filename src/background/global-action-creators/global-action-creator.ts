// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DataTransferActions } from 'background/actions/data-transfer-actions';
import { TRANSFER_QUICK_ASSESS_DATA_TO_ASSESSMENT_INITIATED } from 'common/extension-telemetry-events';
import { CommandsAdapter } from '../../common/browser-adapters/commands-adapter';
import { getStoreStateMessage, Messages } from '../../common/messages';
import { StoreNames } from '../../common/stores/store-names';
import {
    BaseActionPayload,
    OnDetailsViewInitializedPayload,
    PayloadWithEventName,
    SetLaunchPanelState,
    TransferAssessmentPayload,
} from '../actions/action-payloads';
import { AssessmentActions } from '../actions/assessment-actions';
import { CommandActions, GetCommandsPayload } from '../actions/command-actions';
import { GlobalActionHub } from '../actions/global-action-hub';
import { LaunchPanelStateActions } from '../actions/launch-panel-state-action';
import { Interpreter } from '../interpreter';
import { TelemetryEventHandler } from '../telemetry/telemetry-event-handler';

export class GlobalActionCreator {
    private interpreter: Interpreter;
    private commandsAdapter: CommandsAdapter;
    private telemetryEventHandler: TelemetryEventHandler;

    private commandActions: CommandActions;
    private launchPanelStateActions: LaunchPanelStateActions;
    private assessmentActions: AssessmentActions;
    private quickAssessActions: AssessmentActions;
    private dataTransferActions: DataTransferActions;
    private readonly executingScope = 'GlobalActionCreator';

    constructor(
        globalActionHub: GlobalActionHub,
        interpreter: Interpreter,
        commandsAdapter: CommandsAdapter,
        telemetryEventHandler: TelemetryEventHandler,
    ) {
        this.interpreter = interpreter;
        this.commandsAdapter = commandsAdapter;
        this.telemetryEventHandler = telemetryEventHandler;
        this.commandActions = globalActionHub.commandActions;
        this.launchPanelStateActions = globalActionHub.launchPanelStateActions;
        this.assessmentActions = globalActionHub.assessmentActions;
        this.quickAssessActions = globalActionHub.quickAssessActions;
        this.dataTransferActions = globalActionHub.dataTransferActions;
    }

    public registerCallbacks(): void {
        this.interpreter.registerTypeToPayloadCallback(
            getStoreStateMessage(StoreNames.CommandStore),
            this.onGetCommands,
        );

        this.interpreter.registerTypeToPayloadCallback(
            getStoreStateMessage(StoreNames.LaunchPanelStateStore),
            this.onGetLaunchPanelState,
        );
        this.interpreter.registerTypeToPayloadCallback(
            Messages.LaunchPanel.Set,
            this.onSetLaunchPanelState,
        );

        this.interpreter.registerTypeToPayloadCallback(
            Messages.Telemetry.Send,
            this.onSendTelemetry,
        );

        this.interpreter.registerTypeToPayloadCallback(
            Messages.Visualizations.DetailsView.Initialize,
            this.onDetailsViewInitialized,
        );

        this.interpreter.registerTypeToPayloadCallback(
            getStoreStateMessage(StoreNames.DataTransferStore),
            this.onGetDataTransferStoreCurrentState,
        );

        this.interpreter.registerTypeToPayloadCallback(
            Messages.DataTransfer.InitiateTransferDataToAssessment,
            this.onInitiateQuickAssessToAssessmentTransfer,
        );

        this.interpreter.registerTypeToPayloadCallback(
            Messages.DataTransfer.TransferDataToAssessment,
            this.onLoadAssessmentFromTransfer,
        );

        this.interpreter.registerTypeToPayloadCallback(
            Messages.DataTransfer.FinalizeTransferDataToAssessment,
            this.onFinalizeQuickAssessToAssessmentTransfer,
        );
    }

    private onGetCommands = async (_payload, tabId: number): Promise<void> => {
        const commands = await this.commandsAdapter.getCommands();
        const getCommandsPayload: GetCommandsPayload = {
            commands: commands,
            tabId: tabId,
        };
        await this.commandActions.getCommands.invoke(getCommandsPayload);
    };

    private onGetLaunchPanelState = async (): Promise<void> => {
        await this.launchPanelStateActions.getCurrentState.invoke(null);
    };

    private onGetDataTransferStoreCurrentState = async (): Promise<void> => {
        await this.dataTransferActions.getCurrentState.invoke(null);
    };

    private onSetLaunchPanelState = async (payload: SetLaunchPanelState): Promise<void> => {
        await this.launchPanelStateActions.setLaunchPanelType.invoke(payload.launchPanelType);
    };

    private onSendTelemetry = (payload: PayloadWithEventName): void => {
        const eventName = payload.eventName;
        this.telemetryEventHandler.publishTelemetry(eventName, payload);
    };

    private onDetailsViewInitialized = async (
        payload: OnDetailsViewInitializedPayload,
    ): Promise<void> => {
        await this.assessmentActions.updateDetailsViewId.invoke(payload);
        await this.quickAssessActions.updateDetailsViewId.invoke(payload);
    };

    private onInitiateQuickAssessToAssessmentTransfer = async (
        payload: BaseActionPayload,
    ): Promise<void> => {
        await this.dataTransferActions.initiateTransferQuickAssessDataToAssessment.invoke(null);
        this.telemetryEventHandler.publishTelemetry(
            TRANSFER_QUICK_ASSESS_DATA_TO_ASSESSMENT_INITIATED,
            payload,
        );
    };

    private onFinalizeQuickAssessToAssessmentTransfer = async (): Promise<void> => {
        await this.dataTransferActions.finalizeTransferQuickAssessDataToAssessment.invoke(null);
    };

    private onLoadAssessmentFromTransfer = async (
        payload: TransferAssessmentPayload,
    ): Promise<void> => {
        await this.assessmentActions.loadAssessmentFromTransfer.invoke(
            payload,
            this.executingScope,
        );
    };
}
