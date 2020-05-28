// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    browser,
    ExtensionTypes,
    Notifications,
    Permissions,
    Tabs,
    Windows,
} from 'webextension-polyfill-ts';

import { BrowserAdapter } from './browser-adapter';
import { CommandsAdapter } from './commands-adapter';
import { StorageAdapter } from './storage-adapter';

export abstract class WebExtensionBrowserAdapter
    implements BrowserAdapter, StorageAdapter, CommandsAdapter {
    public abstract getManageExtensionUrl(): string;

    public getAllWindows(getInfo: Windows.GetAllGetInfoType): Promise<Windows.Window[]> {
        return browser.windows.getAll(getInfo);
    }

    public addListenerToTabsOnActivated(
        callback: (activeInfo: chrome.tabs.TabActiveInfo) => void,
    ): void {
        chrome.tabs.onActivated.addListener(callback);
    }

    public addListenerToTabsOnUpdated(
        callback: (
            tabId: number,
            changeInfo: chrome.tabs.TabChangeInfo,
            tab: chrome.tabs.Tab,
        ) => void,
    ): void {
        chrome.tabs.onUpdated.addListener(callback);
    }

    public addListenerToWebNavigationUpdated(
        callback: (details: chrome.webNavigation.WebNavigationFramedCallbackDetails) => void,
    ): void {
        chrome.webNavigation.onDOMContentLoaded.addListener(callback);
    }

    public addListenerToTabsOnRemoved(
        callback: (tabId: number, removeInfo: chrome.tabs.TabRemoveInfo) => void,
    ): void {
        chrome.tabs.onRemoved.addListener(callback);
    }

    public addListenerOnWindowsFocusChanged(callback: (windowId: number) => void): void {
        chrome.windows.onFocusChanged.addListener(callback);
    }

    public getRunTimeId(): string {
        return chrome.runtime.id;
    }

    public tabsQuery(query: Tabs.QueryQueryInfoType): Promise<Tabs.Tab[]> {
        return browser.tabs.query(query);
    }

    public getTab(
        tabId: number,
        onResolve: (tab: chrome.tabs.Tab) => void,
        onReject?: () => void,
    ): void {
        chrome.tabs.get(tabId, tab => {
            if (tab) {
                onResolve(tab);
            } else {
                onReject();
            }
        });
    }

    public executeScriptInTab(
        tabId: number,
        details: ExtensionTypes.InjectDetails,
    ): Promise<any[]> {
        return browser.tabs.executeScript(tabId, details);
    }

    public insertCSSInTab(tabId: number, details: ExtensionTypes.InjectDetails): Promise<void> {
        return browser.tabs.insertCSS(tabId, details);
    }

    public createActiveTab(url: string): Promise<Tabs.Tab> {
        return browser.tabs.create({ url, active: true, pinned: false });
    }

    public createTabInNewWindow(url: string): Promise<Tabs.Tab> {
        return browser.windows.create({ url, focused: true }).then(window => window.tabs[0]);
    }

    public updateTab(
        tabId: number,
        updateProperties: Tabs.UpdateUpdatePropertiesType,
    ): Promise<Tabs.Tab> {
        return browser.tabs.update(tabId, updateProperties);
    }

    public updateWindow(
        windowId: number,
        updateProperties: Windows.UpdateUpdateInfoType,
    ): Promise<Windows.Window> {
        return browser.windows.update(windowId, updateProperties);
    }

    public async switchToTab(tabId: number): Promise<void> {
        const tab = await this.updateTab(tabId, { active: true });
        await this.updateWindow(tab.windowId, { focused: true });
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

    public isAllowedFileSchemeAccess(): Promise<boolean> {
        return browser.extension.isAllowedFileSchemeAccess();
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
        callback: (
            message: any,
            sender: chrome.runtime.MessageSender,
            sendResponse: (response: any) => void,
        ) => void,
    ): void {
        chrome.runtime.onMessage.addListener(callback);
    }

    public removeListenerOnMessage(
        callback: (
            message: any,
            sender: chrome.runtime.MessageSender,
            sendResponse: (response: any) => void,
        ) => void,
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

    public requestPermissions(permissions: Permissions.Permissions): Promise<boolean> {
        return browser.permissions.request(permissions);
    }

    public addListenerOnPermissionsAdded(
        callback: (permissions: Permissions.Permissions) => void,
    ): void {
        // casting browser as any due to typings for permissions onAdded not currently supported.
        (browser as any).permissions.onAdded.addListener(callback);
    }

    public addListenerOnPermissionsRemoved(
        callback: (permissions: Permissions.Permissions) => void,
    ): void {
        // casting browser as any due to typings for permissions onRemoved not currently supported.
        (browser as any).permissions.onRemoved.addListener(callback);
    }

    public containsPermissions(permissions: Permissions.Permissions): Promise<boolean> {
        return browser.permissions.contains(permissions);
    }

    public getInspectedWindowTabId(): number {
        return chrome.devtools.inspectedWindow.tabId;
    }
}
