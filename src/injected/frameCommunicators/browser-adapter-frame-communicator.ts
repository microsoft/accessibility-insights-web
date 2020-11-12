// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BrowserAdapter } from 'common/browser-adapters/browser-adapter';

export interface FrameCommunicator {
    sendCommand(destination: Window | HTMLIFrameElement, command: string, data?: any): Promise<any>;
    addCommandListener(command: string, listener: (data?: any) => Promise<any | void>);
}

export class BrowserAdapterFrameCommunicator implements FrameCommunicator {
    constructor() {}

    public sendCommand = async (
        destination: Window | HTMLIFrameElement,
        command: string,
        data?: any,
    ): Promise<any> => {
        const destWindow: Window = destination['contentWindow'] ?? destination;
        destWindow.addEventListener('message', (this.onMessage as unknown) as any);
        destWindow.postMessage(createWindowMessage(command, data), '*');
        return new Promise((resolve, reject) => {
            messageCallbacks[command] = { destWindow, resolve, reject };
        });
    };

    private onMessage = (sourceWindow: Window, event: MessageEvent<any>): any => {
        messageCallbacks;
    };

    addCommandListener(command: string, listener: (data?: any) => Promise<any>) {
        throw new Error('Method not implemented.');
    }

    private;
}
