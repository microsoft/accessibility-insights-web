// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { autobind } from '@uifabric/utilities';

import { Messages } from '../../common/messages';
import * as TelemetryEvents from '../../common/telemetry-events';
import { FeatureFlagActions } from './feature-flag-actions';
import { GlobalActionHub } from './global-action-hub';
import { LaunchPanelStateActions } from './launch-panel-state-action';
import { BrowserAdapter } from '../browser-adapter';
import { Interpreter } from '../interpreter';
import { TelemetryEventHandler } from '../telemetry/telemetry-event-handler';
import { IPayloadWIthEventName, ISetLaunchPanelState, SetTelemetryStatePayload, SetHighContrastModePayload } from './action-payloads';
import { CommandActions, IGetCommandsPayload } from './command-actions';
import { ScopingActions } from './scoping-actions';
import { UserConfigurationActions } from './user-configuration-actions';

export class GlobalActionCreator {
    private _interpreter: Interpreter;
    private _browserAdapter: BrowserAdapter;
    private _telemetryEventHandler: TelemetryEventHandler;

    private _commandActions: CommandActions;
    private _featureFlagActions: FeatureFlagActions;
    private _launchPanelStateActions: LaunchPanelStateActions;
    private _scopingActions: ScopingActions;
    private _userConfigActions: UserConfigurationActions;

    constructor(
        globalActionHub: GlobalActionHub,
        interpreter: Interpreter,
        browserAdapter: BrowserAdapter,
        telemetryEventHandler: TelemetryEventHandler,
    ) {
        this._interpreter = interpreter;
        this._browserAdapter = browserAdapter;
        this._telemetryEventHandler = telemetryEventHandler;
        this._commandActions = globalActionHub.commandActions;
        this._featureFlagActions = globalActionHub.featureFlagActions;
        this._launchPanelStateActions = globalActionHub.launchPanelStateActions;
        this._scopingActions = globalActionHub.scopingActions;
        this._userConfigActions = globalActionHub.userConfigurationActions;
    }

    public registerCallbacks(): void {
        this._interpreter.registerTypeToPayloadCallback(Messages.Command.GetCommands, this.onGetCommands);
        this._interpreter.registerTypeToPayloadCallback(Messages.FeatureFlags.GetFeatureFlags, this.onGetFeatureFlags);
        this._interpreter.registerTypeToPayloadCallback(Messages.FeatureFlags.SetFeatureFlag, this.onSetFeatureFlags);
        this._interpreter.registerTypeToPayloadCallback(Messages.FeatureFlags.ResetFeatureFlag, this.onResetFeatureFlags);

        this._interpreter.registerTypeToPayloadCallback(Messages.LaunchPanel.Get, this.onGetLaunchPanelState);
        this._interpreter.registerTypeToPayloadCallback(Messages.LaunchPanel.Set, this.onSetLaunchPanelState);

        this._interpreter.registerTypeToPayloadCallback(Messages.Scoping.GetCurrentState, this.onGetScopingState);
        this._interpreter.registerTypeToPayloadCallback(Messages.Scoping.AddSelector, this.onAddSelector);
        this._interpreter.registerTypeToPayloadCallback(Messages.Scoping.DeleteSelector, this.onDeleteSelector);

        this._interpreter.registerTypeToPayloadCallback(Messages.Telemetry.Send, this.onSendTelemetry);

        this._interpreter.registerTypeToPayloadCallback(Messages.UserConfig.GetCurrentState, this.onGetUserConfigState);
        this._interpreter.registerTypeToPayloadCallback(Messages.UserConfig.SetTelemetryConfig, this.onSetTelemetryConfiguration);
        this._interpreter.registerTypeToPayloadCallback(Messages.UserConfig.SetHighContrastConfig, this.onSetHighContrastMode);
    }

    @autobind
    private onGetCommands(payload, tabId: number): void {
        this._browserAdapter.getCommands((commands: chrome.commands.Command[]) => {
            const getCommandsPayload: IGetCommandsPayload = {
                commands: commands,
                tabId: tabId,
            };
            this._commandActions.getCommands.invoke(getCommandsPayload);
        });
    }

    @autobind
    private onGetFeatureFlags(payload, tabId: number): void {
        this._featureFlagActions.getCurrentState.invoke(null);
    }

    @autobind
    private onSetFeatureFlags(payload, tabId: number): void {
        this._telemetryEventHandler.publishTelemetry(TelemetryEvents.PREVIEW_FEATURES_TOGGLE, payload, tabId);
        this._featureFlagActions.setFeatureFlag.invoke(payload);
    }

    @autobind
    private onResetFeatureFlags(payload, tabId: number): void {
        this._featureFlagActions.resetFeatureFlags.invoke(null);
    }

    @autobind
    private onGetLaunchPanelState(): void {
        this._launchPanelStateActions.getCurrentState.invoke(null);
    }

    @autobind
    private onSetLaunchPanelState(payload: ISetLaunchPanelState): void {
        this._launchPanelStateActions.setLaunchPanelType.invoke(payload.launchPanelType);
    }

    @autobind
    private onGetScopingState(): void {
        this._scopingActions.getCurrentState.invoke(null);
    }

    @autobind
    private onAddSelector(payload): void {
        this._scopingActions.addSelector.invoke(payload);
    }

    @autobind
    private onDeleteSelector(payload): void {
        this._scopingActions.deleteSelector.invoke(payload);
    }

    @autobind
    private onSendTelemetry(payload: IPayloadWIthEventName, tabId: number) {
        const eventName = payload.eventName;
        this._telemetryEventHandler.publishTelemetry(eventName, payload, tabId);
    }

    @autobind
    private onGetUserConfigState(): void {
        this._userConfigActions.getCurrentState.invoke(null);
    }

    @autobind
    private onSetTelemetryConfiguration(payload: SetTelemetryStatePayload): void {
        this._userConfigActions.setTelemetryState.invoke(payload);
    }

    @autobind
    private onSetHighContrastMode(payload: SetHighContrastModePayload): void {
        this._userConfigActions.setHighContrastMode.invoke(payload);
    }
}
