// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { TelemetryData } from 'common/extension-telemetry-events';
import { Message } from 'common/message';
import { ActionMessageDispatcher } from 'common/message-creators/types/dispatcher';
import { IPC_MESSAGE_CHANNEL_NAME } from './ipc-message-channel-name';

// The most common type of sink is BrowserWindow.webContext.send
export type IpcMessageSink = (channelName: string, message: Message) => void;

export class IpcMessageDispatcher implements ActionMessageDispatcher {
    public dispatchMessage(message: Message): void {
        if (this.registeredSinks.length === 0) {
            console.log(`IpcMessageDispatcher backlogging: ${JSON.stringify(message)}`);
            this.messageBacklog.push(message);
            return;
        }

        console.log(`IpcMessageDispatcher sending: ${JSON.stringify(message)}`);
        for (const sink of this.registeredSinks) {
            sink(IPC_MESSAGE_CHANNEL_NAME, message);
        }
    }

    public dispatchType(messageType: string): void {
        throw new Error('Method not implemented (not yet required for any main process events).');
    }
    public sendTelemetry(eventName: string, eventData: TelemetryData): void {
        throw new Error('Method not implemented (not yet required for any main process events).');
    }

    private messageBacklog: Message[] = [];
    private registeredSinks: IpcMessageSink[] = [];

    public registerMessageSink = (sink: IpcMessageSink): void => {
        this.registeredSinks.push(sink);

        if (this.registeredSinks.length === 1) {
            this.flushMessageBacklog();
        }
    };

    public unregisterMessageSink = (sink: IpcMessageSink): void => {
        this.registeredSinks = this.registeredSinks.filter(
            registeredSink => registeredSink !== sink,
        );
    };

    private flushMessageBacklog = (): void => {
        while (this.messageBacklog.length > 0) {
            this.dispatchMessage(this.messageBacklog.shift());
        }
    };
}
