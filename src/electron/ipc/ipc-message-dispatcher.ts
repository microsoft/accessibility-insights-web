// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { TelemetryData } from 'common/extension-telemetry-events';
import { Message } from 'common/message';
import { ActionMessageDispatcher } from 'common/message-creators/types/dispatcher';
import { IPC_MESSAGE_CHANNEL_NAME } from './ipc-channel-names';

// The most common type of sink is BrowserWindow.webContext.send
export type IpcMessageSink = (channelName: string, message: Message) => void;

export class IpcMessageDispatcher implements ActionMessageDispatcher {
    private registeredSinks: IpcMessageSink[] = [];

    public dispatchMessage(message: Message): void {
        for (const sink of this.registeredSinks) {
            sink(IPC_MESSAGE_CHANNEL_NAME, message);
        }
    }
    public asyncDispatchMessage(message: Message): Promise<void> {
        throw new Error('Method not implemented (not yet required for any main process events).');
    }
    public dispatchType(messageType: string): void {
        throw new Error('Method not implemented (not yet required for any main process events).');
    }
    public sendTelemetry(eventName: string, eventData: TelemetryData): void {
        throw new Error('Method not implemented (not yet required for any main process events).');
    }

    public registerMessageSink = (sink: IpcMessageSink): void => {
        this.registeredSinks.push(sink);
    };

    public unregisterMessageSink = (sink: IpcMessageSink): void => {
        this.registeredSinks = this.registeredSinks.filter(
            registeredSink => registeredSink !== sink,
        );
    };
}
