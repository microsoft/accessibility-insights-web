// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { SetTelemetryStatePayload, SetHighContrastModePayload } from '../../background/actions/action-payloads';
import { Messages } from '../messages';
import { BaseActionMessageCreator } from './base-action-message-creator';

export class UserConfigMessageCreator extends BaseActionMessageCreator {
    public setTelemetryState(enableTelemetry: boolean): void {
        const payload: SetTelemetryStatePayload = {
            enableTelemetry,
        };

        this.dispatchMessageWrapper(Messages.UserConfig.SetUserConfig, this._tabId, payload);
    }

    public setHighContrastMode(enableHighContrast: boolean): void {
        const payload: SetHighContrastModePayload = {
            enableHighContrast,
        };

        this.dispatchMessageWrapper(Messages.UserConfig.SetUserConfig, this._tabId, payload);
    }

    private dispatchMessageWrapper(type, tabId, payload): void {
        this.dispatchMessage({
            type,
            tabId,
            payload,
        });
    }
}
