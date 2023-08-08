// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ipcRenderer } from 'electron';
import { resolve } from 'path';

import { injectCssChannel, injectJsChannel, jsInjectionCompleted } from '../../electron/main/communication-channel';
import { BrowserAdapter, NotificationOptions } from './browser-adapter';
import { CommandsAdapter } from './commands-adapter';
import { StorageAdapter } from './storage-adapter';

export class ElectronRendererAdapter implements BrowserAdapter, StorageAdapter, CommandsAdapter {
    constructor(private readonly sendChannel: string, private readonly listeningChannel) {}

    public createNotification(options: NotificationOptions): void {
        throw new Error('Method not implemented.');
    }

    public addCommandListener(callback: (command: string) => void): void {
        // TODO implement
    }
    public getCommands(callback: (commands: chrome.commands.Command[]) => void): void {
        throw new Error('Method not implemented.');
    }
    public setUserData(items: Object, callback?: () => void): void {
        throw new Error('Method not implemented.');
    }
    public getUserData(keys: string | Object | string[], callback: (items: { [key: string]: any }) => void): void {
        // TODO implement
        const data = {};

        callback(data);
    }
    public removeUserData(key: string): void {
        throw new Error('Method not implemented.');
    }
    public getAllWindows(getInfo: chrome.windows.GetInfo, callback: (chromeWindows: chrome.windows.Window[]) => void): void {
        throw new Error('Method not implemented.');
    }
    public getSelectedTabInWindow(windowId: number, callback: (activeTab: chrome.tabs.Tab) => void): void {
        throw new Error('Method not implemented.');
    }
    public addListenerToTabsOnActivated(callback: (activeInfo: chrome.tabs.TabActiveInfo) => void): void {
        // TODO implement
    }
    public addListenerToTabsOnUpdated(
        callback: (tabId: number, changeInfo: chrome.tabs.TabChangeInfo, tab: chrome.tabs.Tab) => void,
    ): void {
        // TODO implement
    }
    public addListenerToTabsOnRemoved(callback: (tabId: number, removeInfo: chrome.tabs.TabRemoveInfo) => void): void {
        // TODO implement
    }
    public addListenerToWebNavigationUpdated(callback: (details: chrome.webNavigation.WebNavigationFramedCallbackDetails) => void): void {
        // TODO implement
    }
    public addListenerOnWindowsFocusChanged(callback: (windowId: number) => void): void {
        // TODO implement
    }
    public tabsQuery(query: chrome.tabs.QueryInfo, callback: (result: chrome.tabs.Tab[]) => void): void {
        // TODO implement
        // used on background - tab-controller to set up tab context message interpreter
        callback([{ id: 1 } as chrome.tabs.Tab]);
    }
    public createTab(url: string, callback?: (tab: chrome.tabs.Tab) => void): void {
        throw new Error('Method not implemented.');
    }
    public createTabInNewWindow(url: string, callback?: (tab: chrome.tabs.Tab) => void): void {
        throw new Error('Method not implemented.');
    }
    public createInactiveTab(url: string, callback: (tab: chrome.tabs.Tab) => void): void {
        throw new Error('Method not implemented.');
    }
    public closeTab(tabId: number): void {
        throw new Error('Method not implemented.');
    }
    public switchToTab(tabId: number): void {
        throw new Error('Method not implemented.');
    }
    public getTab(tabId: number, onResolve: (tab: chrome.tabs.Tab) => void, onReject?: () => void): void {
        onResolve({ id: 1 } as chrome.tabs.Tab);
    }
    public sendMessageToFramesAndTab = (tabId: number, message: any): void => {
        // TODO implement
        // used on backgound
        ipcRenderer.send(this.sendChannel, message);
    };
    public sendMessageToFrames = (message: any): void => {
        // TODO implement
        // used on details view

        // TODO remove hardcoded tabId here
        if (message.tabId == null) {
            message.tabId = 1;
        }

        ipcRenderer.send(this.sendChannel, message);
    };
    public sendMessageToAllFramesAndTabs = (message: any): void => {
        // TODO implement
        // used on background
        ipcRenderer.send(this.sendChannel, message);
    };
    public injectJs(tabId: any, file: string, callback: Function): void {
        ipcRenderer.send(injectJsChannel, file);

        const _callback = () => {
            ipcRenderer.removeListener(jsInjectionCompleted, _callback);
            callback();
        };
        ipcRenderer.on(jsInjectionCompleted, _callback);
    }
    public injectCss(tabId: any, file: string, callback: Function): void {
        ipcRenderer.send(injectCssChannel, file);
        if (callback) {
            callback();
        }
    }
    public getRunTimeId(): string {
        throw new Error('Method not implemented.');
    }
    public getRuntimeLastError(): chrome.runtime.LastError {
        throw new Error('Method not implemented.');
    }
    public isAllowedFileSchemeAccess(callback: Function): void {
        throw new Error('Method not implemented.');
    }
    public addListenerToLocalStorage(callback: (changes: object) => void): void {
        throw new Error('Method not implemented.');
    }
    public openManageExtensionPage(): void {
        throw new Error('Method not implemented.');
    }
    public addListenerOnConnect(callback: (port: chrome.runtime.Port) => void): void {
        // Implement
    }
    public addListenerOnMessage = (
        callback: (message: any, sender: chrome.runtime.MessageSender, sendResponse: (response: any) => void) => void,
    ): void => {
        // TODO implement this
        // background use this on message-distributor
        // also used on StoreProxy

        const _callback = (message: any, sender: chrome.runtime.MessageSender, sendResponse: (response: any) => void) => {
            // ipcRenderer.on listener param (a Function) have the params in a different order
            // than chrome.runtim.onMessage.addListener
            // so basically, we have the message being the sender and viceversa
            // ipcRenderer use a rest param for the message args (...args: any[])
            // but we use a payload object
            // thus, picking sender[0] is the right approach here
            callback(sender[0], message, sendResponse);
        };
        ipcRenderer.on(this.listeningChannel, _callback);
    };
    public removeListenerOnMessage(
        callback: (message: any, sender: chrome.runtime.MessageSender, sendResponse: (response: any) => void) => void,
    ): void {
        throw new Error('Method not implemented.');
    }
    public connect(connectionInfo?: chrome.runtime.ConnectInfo): chrome.runtime.Port {
        // TODO implement this
        return {
            onDisconnect: { addListener: () => {} },
        } as any;
    }
    public getManifest(): chrome.runtime.Manifest {
        // TODO implement this
        return {
            version: '0.0.1-electron',
            name: 'AI-Web electron',
            icons: {},
        } as chrome.runtime.Manifest;
    }
    public get extensionVersion(): string {
        return this.getManifest().version;
    }
    public getUrl(urlPart: string): string {
        // TODO find a way to get the correct PWD
        return resolve('drop/electron/extension', urlPart);
    }
}
