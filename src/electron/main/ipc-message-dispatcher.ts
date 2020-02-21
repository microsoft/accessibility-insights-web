// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
export type NativeHighContrastModeChangedMessage = {
    id: 'nativeHighContrastModeChanged';
    isHighContrastMode: boolean;
};

export type IpcMessage = NativeHighContrastModeChangedMessage; // | OtherMessage | ...

export type IpcMessageSink = (messageId: string, message: IpcMessage) => void;

export class IpcMessageDispatcher {
    private messageBacklog: IpcMessage[] = [];
    private registeredSinks: IpcMessageSink[] = [];

    public sendMessage = (message: IpcMessage): void => {
        if (this.registeredSinks.length === 0) {
            console.log(`IpcMessageDispatcher backlogging: ${JSON.stringify(message)}`);
            this.messageBacklog.push(message);
            return;
        }

        console.log(`IpcMessageDispatcher sending: ${JSON.stringify(message)}`);
        for (const sink of this.registeredSinks) {
            sink(message.id, message);
        }
    };

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
            this.sendMessage(this.messageBacklog.shift());
        }
    };
}
