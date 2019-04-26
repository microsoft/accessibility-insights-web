// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    SaveIssueFilingSettingsPayload,
    SetHighContrastModePayload,
    SetIssueFilingServicePayload,
    SetIssueFilingServicePropertyPayload,
    SetIssueTrackerPathPayload,
    SetTelemetryStatePayload,
} from '../../background/actions/action-payloads';
import { Messages } from '../messages';
import { IssueFilingServiceProperties } from '../types/store-data/user-configuration-store';
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

    public setIssueFilingService = (issueFilingServiceName: string) => {
        const payload: SetIssueFilingServicePayload = {
            issueFilingServiceName,
        };

        this.dispatchMessage({
            messageType: Messages.UserConfig.SetIssueFilingService,
            tabId: this._tabId,
            payload,
        });
    };

    public setIssueFilingServiceProperty = (issueFilingServiceName: string, propertyName: string, propertyValue: string) => {
        const payload: SetIssueFilingServicePropertyPayload = {
            issueFilingServiceName,
            propertyName,
            propertyValue,
        };

        this.dispatchMessage({
            messageType: Messages.UserConfig.SetIssueFilingServiceProperty,
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

    public saveIssueFilingSettings = (issueFilingServiceName: string, issueFilingSettings: IssueFilingServiceProperties) => {
        const payload: SaveIssueFilingSettingsPayload = {
            issueFilingServiceName,
            issueFilingSettings,
        };

        this.dispatchMessage({
            messageType: Messages.UserConfig.SaveIssueFilingSettings,
            tabId: this._tabId,
            payload,
        });
    };
}
