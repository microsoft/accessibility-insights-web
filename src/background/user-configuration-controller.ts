// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { InterpreterMessage } from 'common/message';
import { Messages } from 'common/messages';
import { SetHighContrastModePayload, SetTelemetryStatePayload } from './actions/action-payloads';
import { Interpreter } from './interpreter';

export class UserConfigurationController {
    constructor(private interpreter: Interpreter) {}

    public async setHighContrastMode(enableHighContrast: boolean): Promise<void> {
        const payload: SetHighContrastModePayload = {
            enableHighContrast,
        };
        const message: InterpreterMessage = {
            messageType: Messages.UserConfig.SetHighContrastConfig,
            payload: payload,
        };
        const response = this.interpreter.interpret(message);
        await response.result;
    }

    public async setTelemetryState(enableTelemetry: boolean): Promise<void> {
        const payload: SetTelemetryStatePayload = {
            enableTelemetry,
        };
        const message: InterpreterMessage = {
            messageType: Messages.UserConfig.SetTelemetryConfig,
            payload: payload,
        };
        const response = this.interpreter.interpret(message);
        await response.result;
    }
}
