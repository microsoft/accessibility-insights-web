// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { browser, ExtensionTypes, Notifications, Tabs } from 'webextension-polyfill-ts';
import { BrowserAdapter } from './browser-adapter';
import { CommandsAdapter } from './commands-adapter';
import { StorageAdapter } from './storage-adapter';

export class ChromeAdapter implements BrowserAdapter, StorageAdapter, CommandsAdapter {
    public getManageExtensionUrl(): string {
        return `chrome://extensions/?id=${chrome.runtime.id}`;
    }

    public getAllWindows(getInfo: chrome.windows.GetInfo, callback: (chromeWindows: chrome.windows.Window[]) => void): void {
        chrome.windows.getAll(getInfo, callback);
    }

    public addListenerToTabsOnActivated(callback: (activeInfo: chrome.tabs.TabActiveInfo) => void): void {
        chrome.tabs.onActivated.addListener(callback);
    }

    public addListenerToTabsOnUpdated(
        callback: (tabId: number, changeInfo: chrome.tabs.TabChangeInfo, tab: chrome.tabs.Tab) => void,
    ): void {
        chrome.tabs.onUpdated.addListener(callback);
    }

    public addListenerToWebNavigationUpdated(callback: (details: chrome.webNavigation.WebNavigationFramedCallbackDetails) => void): void {
        chrome.webNavigation.onDOMContentLoaded.addListener(callback);
    }

    public addListenerToTabsOnRemoved(callback: (tabId: number, removeInfo: chrome.tabs.TabRemoveInfo) => void): void {
        chrome.tabs.onRemoved.addListener(callback);
    }

    public addListenerOnWindowsFocusChanged(callback: (windowId: number) => void): void {
        chrome.windows.onFocusChanged.addListener(callback);
    }

    public getRunTimeId(): string {
        return chrome.runtime.id;
    }
    public tabsQuery(query: chrome.tabs.QueryInfo, callback: (result: chrome.tabs.Tab[]) => void): void {
        chrome.tabs.query(query, callback);
    }

    public getTab(tabId: number, onResolve: (tab: chrome.tabs.Tab) => void, onReject?: () => void): void {
        chrome.tabs.get(tabId, tab => {
            if (tab) {
                onResolve(tab);
            } else {
                onReject();
            }
        });
    }

    public executeScriptInTab(tabId: number, details: ExtensionTypes.InjectDetails): Promise<any[]> {
        return browser.tabs.executeScript(tabId, details);
    }

    public insertCSSInTab(tabId: number, details: ExtensionTypes.InjectDetails): Promise<void> {
        return browser.tabs.insertCSS(tabId, details);
    }

    public createActiveTab(url: string): Promise<Tabs.Tab> {
        return browser.tabs.create({ url, active: true, pinned: false });
    }

    public createTabInNewWindow(url: string, callback?: (tab: chrome.tabs.Tab) => void): void {
        chrome.windows.create(
            {
                url: url,
                focused: true,
            },
            window => {
                callback(window.tabs[0]);
            },
        );
    }

    public createTabInNewWindowP(url: string): Promise<Tabs.Tab> {
        return browser.windows.create({ url, focused: true }).then(window => window.tabs[0]);
    }

    public createInactiveTab(url: string, callback: (tab: chrome.tabs.Tab) => void): void {
        chrome.tabs.create(
            {
                url: url,
                active: false,
                pinned: false,
            },
            callback,
        );
    }

    public closeTab(tabId: number): void {
        chrome.tabs.remove(tabId);
    }

    public switchToTab(tabId: number): void {
        const props = {
            active: true,
        };

        chrome.tabs.update(tabId, props, tab => {
            chrome.windows.update(tab.windowId, { focused: true });
        });
    }

    public sendMessageToTab(tabId: number, message: any): Promise<void> {
        return browser.tabs.sendMessage(tabId, message);
    }

    public sendMessageToFrames(message: any): Promise<void> {
        return browser.runtime.sendMessage(message);
    }

    public setUserData(items: Object): Promise<void> {
        return browser.storage.local.set(items);
    }

    public getUserData(keys: string[]): Promise<{ [key: string]: any }> {
        return browser.storage.local.get(keys);
    }

    public removeUserData(key: string): Promise<void> {
        return browser.storage.local.remove(key);
    }

    public getRuntimeLastError(): chrome.runtime.LastError {
        return chrome.runtime.lastError;
    }

    public createNotification(options: Notifications.CreateNotificationOptions): Promise<string> {
        return browser.notifications.create(options);
    }

    public isAllowedFileSchemeAccess(callback: (isAllowed: boolean) => void): void {
        chrome.extension.isAllowedFileSchemeAccess(callback);
    }

    public addListenerToLocalStorage(callback: (changes: object) => void): void {
        chrome.storage.onChanged.addListener(callback);
    }

    public addCommandListener(callback: (command: string) => void): void {
        chrome.commands.onCommand.addListener(callback);
    }

    public getCommands(callback: (commands: chrome.commands.Command[]) => void): void {
        chrome.commands.getAll(callback);
    }

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

    public getVersion(): string {
        return this.getManifest().version;
    }

    public getUrl(urlPart: string): string {
        return chrome.extension.getURL(urlPart);
    }
}
