// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

export interface IClientChromeAdapter {
    addListenerOnConnect(callback: (port: chrome.runtime.Port) => void);
    addListenerOnMessage(callback: (message: any, sender: chrome.runtime.MessageSender, sendResponse: (response: any) => void) => void);

    removeListenerOnMessage(callback: (message: any, sender: chrome.runtime.MessageSender, sendResponse: (response: any) => void) => void);
    connect(connectionInfo?: chrome.runtime.ConnectInfo): chrome.runtime.Port;
    sendMessageToFrames(message: any);
    getManifest(): chrome.runtime.Manifest;

    getUrl(urlPart: string): string;
}

export class ClientChromeAdapter implements IClientChromeAdapter {

    public addListenerOnConnect(callback: (port: chrome.runtime.Port) => void) {
        chrome.runtime.onConnect.addListener(callback);
    }

    public addListenerOnMessage(callback: (message: any, sender: chrome.runtime.MessageSender, sendResponse: (response: any) => void) => void) {
        chrome.runtime.onMessage.addListener(callback);
    }

    public removeListenerOnMessage(callback: (message: any, sender: chrome.runtime.MessageSender, sendResponse: (response: any) => void) => void) {
        chrome.runtime.onMessage.removeListener(callback);
    }

    public connect(connectionInfo?: chrome.runtime.ConnectInfo): chrome.runtime.Port {
        return chrome.runtime.connect(chrome.runtime.id, connectionInfo);
    }

    public getManifest(): chrome.runtime.Manifest {
        return chrome.runtime.getManifest();
    }

    public sendMessageToFrames(message: any) {
        chrome.runtime.sendMessage(message);
    }

    public getUrl(urlPart: string): string {
        return chrome.extension.getURL(urlPart);
    }
}


