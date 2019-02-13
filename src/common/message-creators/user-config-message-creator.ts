// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { SetTelemetryStatePayload, SetHighContrastModePayload, SetIssueTrackerPathPayload } from '../../background/actions/action-payloads';
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

    public setIssueTrackerPath(issueTrackerPath: string): void {
        const payload: SetIssueTrackerPathPayload = {
            issueTrackerPath
        };

        this.dispatchMessage({
            type: Messages.UserConfig.SetIssueTrackerPath,
            tabId: this._tabId,
            payload
        });
    }
}
