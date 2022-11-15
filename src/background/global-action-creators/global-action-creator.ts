// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { CommandsAdapter } from '../../common/browser-adapters/commands-adapter';
import { getStoreStateMessage, Messages } from '../../common/messages';
import { StoreNames } from '../../common/stores/store-names';
import {
    OnDetailsViewInitializedPayload,
    PayloadWithEventName,
    SetLaunchPanelState,
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
}
