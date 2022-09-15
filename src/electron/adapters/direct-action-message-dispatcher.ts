// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Interpreter } from 'background/interpreter';
import { TelemetryData } from 'common/extension-telemetry-events';
import { Message } from 'common/message';
import { ActionMessageDispatcher } from 'common/message-creators/types/dispatcher';

export class DirectActionMessageDispatcher implements ActionMessageDispatcher {
    constructor(private readonly interpreter: Interpreter) {}

    public dispatchMessage(message: Message): void {
        this.interpreter.interpret(message);
    }
    public asyncDispatchMessage(message: Message): Promise<void> {
        // not needed yet on electron
        throw new Error('Method not implemented.');
    }
    public dispatchType(messageType: string): void {
        // not needed yet on electron
        throw new Error('Method not implemented.');
    }
    public sendTelemetry(eventName: string, eventData: TelemetryData): void {
        // not needed yet on electron
        console.warn('Method not implemented.');
    }
}
