// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import 'reflect-metadata';

import { injectable } from 'inversify';

export interface ClientBrowserAdapter {
    addListenerOnConnect(callback: (port: chrome.runtime.Port) => void): void;
    addListenerOnMessage(
        callback: (message: any, sender: chrome.runtime.MessageSender, sendResponse: (response: any) => void) => void,
    ): void;

    removeListenerOnMessage(
        callback: (message: any, sender: chrome.runtime.MessageSender, sendResponse: (response: any) => void) => void,
    ): void;
    connect(connectionInfo?: chrome.runtime.ConnectInfo): chrome.runtime.Port;
    sendMessageToFrames(message: any): void;
    getManifest(): chrome.runtime.Manifest;
    extensionVersion: string;

    getUrl(urlPart: string): string;
}

@injectable()
export class ClientChromeAdapter implements ClientBrowserAdapter {
    public addListenerOnConnect(callback: (port: chrome.runtime.Port) => void): void {
        chrome.runtime.onConnect.addListener(callback);
    }

    public addListenerOnMessage(
        callback: (message: any, sender: chrome.runtime.MessageSender, sendResponse: (response: any) => void) => void,
    ): void {
        chrome.runtime.onMessage.addListener(callback);
    }

    public removeListenerOnMessage(
        callback: (message: any, sender: chrome.runtime.MessageSender, sendResponse: (response: any) => void) => void,
    ): void {
        chrome.runtime.onMessage.removeListener(callback);
    }

    public connect(connectionInfo?: chrome.runtime.ConnectInfo): chrome.runtime.Port {
        return chrome.runtime.connect(chrome.runtime.id, connectionInfo);
    }

    public getManifest(): chrome.runtime.Manifest {
        return chrome.runtime.getManifest();
    }

    public get extensionVersion(): string {
        return this.getManifest().version;
    }

    public sendMessageToFrames(message: any): void {
        chrome.runtime.sendMessage(message);
    }

    public getUrl(urlPart: string): string {
        return chrome.extension.getURL(urlPart);
    }
}
