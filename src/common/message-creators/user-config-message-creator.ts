// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { SetTelemetryStatePayload } from '../../background/actions/action-payloads';
import { Messages } from '../messages';
import { BaseActionMessageCreator } from './base-action-message-creator';

export class UserConfigMessageCreator extends BaseActionMessageCreator {
    public setTelemetryState(enableTelemetry: boolean): void {
        const payload: SetTelemetryStatePayload = {
            enableTelemetry,
        };

        this.dispatchMessage({
            type: Messages.UserConfig.SetUserConfig,
            tabId: this._tabId,
            payload,
        });
    }
}
