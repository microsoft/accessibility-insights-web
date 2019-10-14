// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    SaveIssueFilingSettingsPayload,
    SetHighContrastModePayload,
    SetIssueFilingServicePayload,
    SetIssueFilingServicePropertyPayload,
    SetTelemetryStatePayload,
} from 'background/actions/action-payloads';
import { UserConfigurationActionCreator } from 'background/global-action-creators/types/user-configuration-action-creator';

import { Messages } from '../messages';
import { ActionMessageDispatcher } from './action-message-dispatcher';

export class UserConfigMessageCreator implements UserConfigurationActionCreator {
    constructor(private readonly dispatcher: ActionMessageDispatcher) {}

    public setTelemetryState(payload: SetTelemetryStatePayload): void {
        this.dispatcher.dispatchMessage({
            messageType: Messages.UserConfig.SetTelemetryConfig,
            payload,
        });
    }

    public setHighContrastMode(payload: SetHighContrastModePayload): void {
        this.dispatcher.dispatchMessage({
            messageType: Messages.UserConfig.SetHighContrastConfig,
            payload,
        });
    }

    public setIssueFilingService = (payload: SetIssueFilingServicePayload) => {
        this.dispatcher.dispatchMessage({
            messageType: Messages.UserConfig.SetIssueFilingService,
            payload,
        });
    };

    public setIssueFilingServiceProperty = (payload: SetIssueFilingServicePropertyPayload) => {
        this.dispatcher.dispatchMessage({
            messageType: Messages.UserConfig.SetIssueFilingServiceProperty,
            payload,
        });
    };

    public saveIssueFilingSettings = (payload: SaveIssueFilingSettingsPayload) => {
        this.dispatcher.dispatchMessage({
            messageType: Messages.UserConfig.SaveIssueFilingSettings,
            payload,
        });
    };
}
