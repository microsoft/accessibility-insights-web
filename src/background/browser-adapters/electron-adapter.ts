// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ipcRenderer } from 'electron';

import { BrowserAdapter, NotificationOptions } from './browser-adapter';
import { CommandsAdapter } from './commands-adapter';
import { StorageAdapter } from './storage-adapter';

export class ElectronAdapter implements BrowserAdapter, StorageAdapter, CommandsAdapter {
    constructor(private readonly channel: string) {}

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
    public sendMessageToFramesAndTab(tabId: number, message: any): void {
        // TODO implement
    }
    public sendMessageToFrames = (message: any): void => {
        // TODO implement
        console.log(this.channel, 'on to frames');
        ipcRenderer.send(this.channel, message);
    };
    public sendMessageToAllFramesAndTabs(message: any): void {
        // TODO implement
    }
    public injectJs(tabId: any, file: string, callback: Function): void {
        throw new Error('Method not implemented.');
    }
    public injectCss(tabId: any, file: string, callback: Function): void {
        throw new Error('Method not implemented.');
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
    public addListenerOnMessage(
        callback: (message: any, sender: chrome.runtime.MessageSender, sendResponse: (response: any) => void) => void,
    ): void {
        // TODO implement this
    }
    public removeListenerOnMessage(
        callback: (message: any, sender: chrome.runtime.MessageSender, sendResponse: (response: any) => void) => void,
    ): void {
        throw new Error('Method not implemented.');
    }
    public connect(connectionInfo?: chrome.runtime.ConnectInfo): chrome.runtime.Port {
        throw new Error('Method not implemented.');
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
        throw new Error('Method not implemented.');
    }
}
