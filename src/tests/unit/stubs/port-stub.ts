// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { PortDisconnectStub, PortOnMessageStub } from './chrome-adapter-stub';

export class PortStub implements chrome.runtime.Port {
    public sender: chrome.runtime.MessageSender;
    public onDisconnect: PortDisconnectStub;
    public onMessage: PortOnMessageStub;
    public name: string;

    constructor() {
        this.onDisconnect = new PortDisconnectStub();
        this.onMessage = new PortOnMessageStub();
    }

    public disconnect(): void {
        this.onDisconnect.disconnect(this);
    }

    public postMessage(message: Object): void {
        this.onMessage.sendMessage(message);
    }
}
