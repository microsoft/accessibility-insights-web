// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Message } from 'common/message';
import { Messages } from 'common/messages';
import { SetHighContrastModePayload, SetTelemetryStatePayload } from './actions/action-payloads';
import { Interpreter } from './interpreter';

export class UserConfigurationController {
    constructor(private interpreter: Interpreter) {}

    public setHighContrastMode(enableHighContrast: boolean): void {
        const payload: SetHighContrastModePayload = {
            enableHighContrast,
        };
        const message: Message = {
            messageType: Messages.UserConfig.SetHighContrastConfig,
            payload: payload,
            tabId: null,
        };
        this.interpreter.interpret(message);
    }

    public setTelemetryState(enableTelemetry: boolean): void {
        const payload: SetTelemetryStatePayload = {
            enableTelemetry,
        };
        const message: Message = {
            messageType: Messages.UserConfig.SetTelemetryConfig,
            payload: payload,
            tabId: null,
        };
        this.interpreter.interpret(message);
    }
}
