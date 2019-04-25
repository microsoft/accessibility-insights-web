// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { autobind } from '@uifabric/utilities';

import { Messages } from '../../common/messages';
import * as TelemetryEvents from '../../common/telemetry-events';
import { BrowserAdapter } from '../browser-adapter';
import { Interpreter } from '../interpreter';
import { TelemetryEventHandler } from '../telemetry/telemetry-event-handler';
import {
    PayloadWithEventName,
    SaveIssueFilingSettingsPayload,
    SetIssueServicePayload,
    SetIssueServicePropertyPayload,
    SetHighContrastModePayload,
    SetIssueTrackerPathPayload,
    SetLaunchPanelState,
    SetTelemetryStatePayload,
} from './action-payloads';
import { CommandActions, GetCommandsPayload } from './command-actions';
import { FeatureFlagActions } from './feature-flag-actions';
import { GlobalActionHub } from './global-action-hub';
import { LaunchPanelStateActions } from './launch-panel-state-action';
import { ScopingActions } from './scoping-actions';
import { UserConfigurationActions } from './user-configuration-actions';

export class GlobalActionCreator {
    private interpreter: Interpreter;
    private browserAdapter: BrowserAdapter;
    private telemetryEventHandler: TelemetryEventHandler;

    private commandActions: CommandActions;
    private featureFlagActions: FeatureFlagActions;
    private launchPanelStateActions: LaunchPanelStateActions;
    private scopingActions: ScopingActions;
    private userConfigActions: UserConfigurationActions;

    constructor(
        globalActionHub: GlobalActionHub,
        interpreter: Interpreter,
        browserAdapter: BrowserAdapter,
        telemetryEventHandler: TelemetryEventHandler,
    ) {
        this.interpreter = interpreter;
        this.browserAdapter = browserAdapter;
        this.telemetryEventHandler = telemetryEventHandler;
        this.commandActions = globalActionHub.commandActions;
        this.featureFlagActions = globalActionHub.featureFlagActions;
        this.launchPanelStateActions = globalActionHub.launchPanelStateActions;
        this.scopingActions = globalActionHub.scopingActions;
        this.userConfigActions = globalActionHub.userConfigurationActions;
    }

    public registerCallbacks(): void {
        this.interpreter.registerTypeToPayloadCallback(Messages.Command.GetCommands, this.onGetCommands);
        this.interpreter.registerTypeToPayloadCallback(Messages.FeatureFlags.GetFeatureFlags, this.onGetFeatureFlags);
        this.interpreter.registerTypeToPayloadCallback(Messages.FeatureFlags.SetFeatureFlag, this.onSetFeatureFlags);
        this.interpreter.registerTypeToPayloadCallback(Messages.FeatureFlags.ResetFeatureFlag, this.onResetFeatureFlags);

        this.interpreter.registerTypeToPayloadCallback(Messages.LaunchPanel.Get, this.onGetLaunchPanelState);
        this.interpreter.registerTypeToPayloadCallback(Messages.LaunchPanel.Set, this.onSetLaunchPanelState);

        this.interpreter.registerTypeToPayloadCallback(Messages.Scoping.GetCurrentState, this.onGetScopingState);
        this.interpreter.registerTypeToPayloadCallback(Messages.Scoping.AddSelector, this.onAddSelector);
        this.interpreter.registerTypeToPayloadCallback(Messages.Scoping.DeleteSelector, this.onDeleteSelector);

        this.interpreter.registerTypeToPayloadCallback(Messages.Telemetry.Send, this.onSendTelemetry);

        this.interpreter.registerTypeToPayloadCallback(Messages.UserConfig.GetCurrentState, this.onGetUserConfigState);
        this.interpreter.registerTypeToPayloadCallback(Messages.UserConfig.SetTelemetryConfig, this.onSetTelemetryConfiguration);
        this.interpreter.registerTypeToPayloadCallback(Messages.UserConfig.SetHighContrastConfig, this.onSetHighContrastMode);
        this.interpreter.registerTypeToPayloadCallback(Messages.UserConfig.SetIssueService, this.onSetIssueService);
        this.interpreter.registerTypeToPayloadCallback(Messages.UserConfig.SetIssueServiceProperty, this.onSetIssueServiceProperty);
        this.interpreter.registerTypeToPayloadCallback(Messages.UserConfig.SetIssueTrackerPath, this.onSetIssueTrackerPath);
        this.interpreter.registerTypeToPayloadCallback(Messages.UserConfig.SaveIssueFilingSettings, this.onSaveIssueFilingSettings);
    }

    @autobind
    private onGetCommands(payload, tabId: number): void {
        this.browserAdapter.getCommands((commands: chrome.commands.Command[]) => {
            const getCommandsPayload: GetCommandsPayload = {
                commands: commands,
                tabId: tabId,
            };
            this.commandActions.getCommands.invoke(getCommandsPayload);
        });
    }

    @autobind
    private onGetFeatureFlags(payload, tabId: number): void {
        this.featureFlagActions.getCurrentState.invoke(null);
    }

    @autobind
    private onSetFeatureFlags(payload): void {
        this.telemetryEventHandler.publishTelemetry(TelemetryEvents.PREVIEW_FEATURES_TOGGLE, payload);
        this.featureFlagActions.setFeatureFlag.invoke(payload);
    }

    @autobind
    private onResetFeatureFlags(payload, tabId: number): void {
        this.featureFlagActions.resetFeatureFlags.invoke(null);
    }

    @autobind
    private onGetLaunchPanelState(): void {
        this.launchPanelStateActions.getCurrentState.invoke(null);
    }

    @autobind
    private onSetLaunchPanelState(payload: SetLaunchPanelState): void {
        this.launchPanelStateActions.setLaunchPanelType.invoke(payload.launchPanelType);
    }

    @autobind
    private onGetScopingState(): void {
        this.scopingActions.getCurrentState.invoke(null);
    }

    @autobind
    private onAddSelector(payload): void {
        this.scopingActions.addSelector.invoke(payload);
    }

    @autobind
    private onDeleteSelector(payload): void {
        this.scopingActions.deleteSelector.invoke(payload);
    }

    @autobind
    private onSendTelemetry(payload: PayloadWithEventName): void {
        const eventName = payload.eventName;
        this.telemetryEventHandler.publishTelemetry(eventName, payload);
    }

    @autobind
    private onGetUserConfigState(): void {
        this.userConfigActions.getCurrentState.invoke(null);
    }

    @autobind
    private onSetTelemetryConfiguration(payload: SetTelemetryStatePayload): void {
        this.userConfigActions.setTelemetryState.invoke(payload);
    }

    @autobind
    private onSetHighContrastMode(payload: SetHighContrastModePayload): void {
        this.userConfigActions.setHighContrastMode.invoke(payload);
    }

    @autobind
    private onSetIssueService(payload: SetIssueServicePayload): void {
        this.userConfigActions.setIssueService.invoke(payload);
    }

    @autobind
    private onSetIssueServiceProperty(payload: SetIssueServicePropertyPayload): void {
        this.userConfigActions.setIssueServiceProperty.invoke(payload);
    }

    @autobind
    private onSetIssueTrackerPath(payload: SetIssueTrackerPathPayload): void {
        this.userConfigActions.setIssueTrackerPath.invoke(payload);
    }

    @autobind
    private onSaveIssueFilingSettings(payload: SaveIssueFilingSettingsPayload): void {
        this.userConfigActions.saveIssueFilingSettings.invoke(payload);
    }
}
