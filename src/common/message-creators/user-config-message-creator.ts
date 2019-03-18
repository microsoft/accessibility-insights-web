// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    SetBugServicePayload,
    SetBugServicePropertyPayload,
    SetHighContrastModePayload,
    SetIssueTrackerPathPayload,
    SetTelemetryStatePayload,
} from '../../background/actions/action-payloads';
import { Messages } from '../messages';
import { BaseActionMessageCreator } from './base-action-message-creator';

export class UserConfigMessageCreator extends BaseActionMessageCreator {
    public setTelemetryState(enableTelemetry: boolean): void {
        const payload: SetTelemetryStatePayload = {
            enableTelemetry,
        };

        this.dispatchMessage({
            type: Messages.UserConfig.SetTelemetryConfig,
            tabId: this._tabId,
            payload,
        });
    }

    public setHighContrastMode(enableHighContrast: boolean): void {
        const payload: SetHighContrastModePayload = {
            enableHighContrast,
        };

        this.dispatchMessage({
            type: Messages.UserConfig.SetHighContrastConfig,
            tabId: this._tabId,
            payload,
        });
    }

    public setBugService(bugServiceName: string): void {
        const payload: SetBugServicePayload = {
            bugServiceName,
        };

        this.dispatchMessage({
            type: Messages.UserConfig.SetBugService,
            tabId: this._tabId,
            payload,
        });
    }

    public setBugServiceProperty(bugServiceName: string, propertyName: string, propertyValue: string): void {
        const payload: SetBugServicePropertyPayload = {
            bugServiceName,
            propertyName,
            propertyValue,
        };

        this.dispatchMessage({
            type: Messages.UserConfig.SetBugServiceProperty,
            tabId: this._tabId,
            payload,
        });
    }

    public setIssueTrackerPath(issueTrackerPath: string): void {
        const payload: SetIssueTrackerPathPayload = {
            issueTrackerPath,
        };

        this.dispatchMessage({
            type: Messages.UserConfig.SetIssueTrackerPath,
            tabId: this._tabId,
            payload,
        });
    }
}
