// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    SaveIssueFilingSettingsPayload,
    SetHighContrastModePayload,
    SetIssueServicePayload,
    SetIssueServicePropertyPayload,
    SetIssueTrackerPathPayload,
    SetTelemetryStatePayload,
} from '../../background/actions/action-payloads';
import { Messages } from '../messages';
import { IssueServiceProperties } from '../types/store-data/user-configuration-store';
import { BaseActionMessageCreator } from './base-action-message-creator';

export class UserConfigMessageCreator extends BaseActionMessageCreator {
    public setTelemetryState(enableTelemetry: boolean): void {
        const payload: SetTelemetryStatePayload = {
            enableTelemetry,
        };

        this.dispatchMessage({
            messageType: Messages.UserConfig.SetTelemetryConfig,
            tabId: this._tabId,
            payload,
        });
    }

    public setHighContrastMode(enableHighContrast: boolean): void {
        const payload: SetHighContrastModePayload = {
            enableHighContrast,
        };

        this.dispatchMessage({
            messageType: Messages.UserConfig.SetHighContrastConfig,
            tabId: this._tabId,
            payload,
        });
    }

    public setIssueService = (issueServiceName: string) => {
        const payload: SetIssueServicePayload = {
            issueServiceName,
        };

        this.dispatchMessage({
            messageType: Messages.UserConfig.SetIssueService,
            tabId: this._tabId,
            payload,
        });
    };

    public setIssueServiceProperty = (issueServiceName: string, propertyName: string, propertyValue: string) => {
        const payload: SetIssueServicePropertyPayload = {
            issueServiceName,
            propertyName,
            propertyValue,
        };

        this.dispatchMessage({
            messageType: Messages.UserConfig.SetIssueServiceProperty,
            tabId: this._tabId,
            payload,
        });
    };

    public setIssueTrackerPath = (issueTrackerPath: string) => {
        const payload: SetIssueTrackerPathPayload = {
            issueTrackerPath,
        };

        this.dispatchMessage({
            messageType: Messages.UserConfig.SetIssueTrackerPath,
            tabId: this._tabId,
            payload,
        });
    };

    public saveIssueFilingSettings = (issueServiceName: string, issueFilingSettings: IssueServiceProperties) => {
        const payload: SaveIssueFilingSettingsPayload = {
            issueServiceName,
            issueFilingSettings,
        };

        this.dispatchMessage({
            messageType: Messages.UserConfig.SaveIssueFilingSettings,
            tabId: this._tabId,
            payload,
        });
    };
}
