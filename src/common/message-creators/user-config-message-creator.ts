// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    SaveIssueFilingSettingsPayload,
    SetHighContrastModePayload,
    SetIssueFilingServicePayload,
    SetIssueFilingServicePropertyPayload,
    SetTelemetryStatePayload,
} from 'background/actions/action-payloads';
import { Messages } from '../messages';
import { IssueFilingServiceProperties } from '../types/store-data/user-configuration-store';
import { ActionMessageDispatcher } from './action-message-dispatcher';

export class UserConfigMessageCreator {
    constructor(private readonly dispatcher: ActionMessageDispatcher) {}
    public setTelemetryState(enableTelemetry: boolean): void {
        const payload: SetTelemetryStatePayload = {
            enableTelemetry,
        };

        this.dispatcher.dispatchMessage({
            messageType: Messages.UserConfig.SetTelemetryConfig,
            payload,
        });
    }

    public setHighContrastMode(enableHighContrast: boolean): void {
        const payload: SetHighContrastModePayload = {
            enableHighContrast,
        };

        this.dispatcher.dispatchMessage({
            messageType: Messages.UserConfig.SetHighContrastConfig,
            payload,
        });
    }

    public setIssueFilingService = (issueFilingServiceName: string) => {
        const payload: SetIssueFilingServicePayload = {
            issueFilingServiceName,
        };

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

    public saveIssueFilingSettings = (issueFilingServiceName: string, issueFilingSettings: IssueFilingServiceProperties) => {
        const payload: SaveIssueFilingSettingsPayload = {
            issueFilingServiceName,
            issueFilingSettings,
        };

        this.dispatcher.dispatchMessage({
            messageType: Messages.UserConfig.SaveIssueFilingSettings,
            payload,
        });
    };
}
