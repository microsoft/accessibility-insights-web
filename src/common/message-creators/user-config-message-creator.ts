// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    SaveIssueFilingSettingsPayload,
    SetBugServicePayload,
    SetBugServicePropertyPayload,
    SetHighContrastModePayload,
    SetIssueTrackerPathPayload,
    SetTelemetryStatePayload,
} from '../../background/actions/action-payloads';
import { Messages } from '../messages';
import { BugServiceProperties } from '../types/store-data/user-configuration-store';
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

    public setBugService = (bugServiceName: string) => {
        const payload: SetBugServicePayload = {
            bugServiceName,
        };

        this.dispatchMessage({
            messageType: Messages.UserConfig.SetBugService,
            tabId: this._tabId,
            payload,
        });
    };

    public setBugServiceProperty = (bugServiceName: string, propertyName: string, propertyValue: string) => {
        const payload: SetBugServicePropertyPayload = {
            bugServiceName,
            propertyName,
            propertyValue,
        };

        this.dispatchMessage({
            messageType: Messages.UserConfig.SetBugServiceProperty,
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

    public saveIssueFilingSettings = (bugServiceName: string, bugFilingSettings: BugServiceProperties) => {
        const payload: SaveIssueFilingSettingsPayload = {
            bugServiceName,
            bugFilingSettings,
        };

        this.dispatchMessage({
            messageType: Messages.UserConfig.SaveIssueFilingSettings,
            tabId: this._tabId,
            payload,
        });
    };
}
