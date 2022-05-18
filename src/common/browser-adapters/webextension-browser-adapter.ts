// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BrowserEventManager } from 'common/browser-adapters/browser-event-manager';
import { DictionaryStringTo } from 'types/common-types';
import browser, {
    Events,
    Notifications,
    Permissions,
    Runtime,
    Tabs,
    Windows,
} from 'webextension-polyfill';

import { BrowserAdapter } from './browser-adapter';
import { CommandsAdapter } from './commands-adapter';
import { StorageAdapter } from './storage-adapter';

export abstract class WebExtensionBrowserAdapter
    implements BrowserAdapter, StorageAdapter, CommandsAdapter
{
    constructor(private readonly browserEventManager: BrowserEventManager) {}

    public initialize(browserEvents: DictionaryStringTo<Events.Event<any>>): void {
        // Add browser listeners synchronously on initialization
        for (const [eventType, event] of Object.entries(browserEvents)) {
            this.browserEventManager.addBrowserListener(event, eventType);
        }
    }

    public abstract getManageExtensionUrl(): string;

    public getAllWindows(getInfo: Windows.GetAllGetInfoType): Promise<Windows.Window[]> {
        return browser.windows.getAll(getInfo);
    }

    public addListenerToTabsOnActivated(
        callback: (activeInfo: chrome.tabs.TabActiveInfo) => void,
    ): void {
        this.browserEventManager.addApplicationListener('TabsOnActivated', callback);
    }

    public addListenerToTabsOnUpdated(
        callback: (
            tabId: number,
            changeInfo: chrome.tabs.TabChangeInfo,
            tab: chrome.tabs.Tab,
        ) => void,
    ): void {
        this.browserEventManager.addApplicationListener('TabsOnUpdated', callback);
    }

    public addListenerToWebNavigationUpdated(
        callback: (details: chrome.webNavigation.WebNavigationFramedCallbackDetails) => void,
    ): void {
        this.browserEventManager.addApplicationListener(
            'WebNavigationOnDOMContentLoaded',
            callback,
        );
    }

    public addListenerToTabsOnRemoved(
        callback: (tabId: number, removeInfo: chrome.tabs.TabRemoveInfo) => void,
    ): void {
        this.browserEventManager.addApplicationListener('TabsOnRemoved', callback);
    }

    public addListenerOnWindowsFocusChanged(callback: (windowId: number) => void): void {
        this.browserEventManager.addApplicationListener('WindowsOnFocusChanged', callback);
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
                if (onReject != null) {
                    onReject();
                }
            }
        });
    }

    private verifyPathCompatibility(path?: string): void {
        const looksRelative = path != null && !path.startsWith('/') && !path.includes('://');
        if (looksRelative) {
            throw new Error(
                `Relative path ${path} is unsafe to use here because Firefox and Chromium ` +
                    'interpret it differently. Firefox treats it as relative to the containing ' +
                    'page, but Chromium treats it as relative to the extension root. Use a path ' +
                    'like /relative/to/ext/root.js to get consistent cross-browser behavior.',
            );
        }
    }

    public executeScriptInTab(
        tabId: number,
        details: {
            file: string;
            allFrames?: boolean | undefined;
        },
    ): Promise<any[]> {
        this.verifyPathCompatibility(details.file);
        return typeof browser.tabs.executeScript === 'function'
            ? browser.tabs.executeScript(tabId, details)
            : chrome.scripting.executeScript({
                  target: { tabId, allFrames: details.allFrames },
                  files: [details.file],
              });
    }

    public insertCSSInTab(
        tabId: number,
        details: {
            file: string;
            allFrames?: boolean | undefined;
        },
    ): Promise<void> {
        this.verifyPathCompatibility(details.file);
        return typeof browser.tabs.insertCSS === 'function'
            ? browser.tabs.insertCSS(tabId, details)
            : chrome.scripting.insertCSS({
                  target: { tabId, allFrames: details.allFrames },
                  files: [details.file],
              });
    }

    public createActiveTab(url: string): Promise<Tabs.Tab> {
        return browser.tabs.create({ url, active: true, pinned: false });
    }

    public async createTabInNewWindow(url: string): Promise<Tabs.Tab> {
        const newWindow = await browser.windows.create({ url, focused: true });
        if (newWindow.tabs == null) {
            throw new Error('Browser created a window with no tabs');
        }
        return newWindow.tabs[0];
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
        if (tab.windowId == null) {
            throw new Error('Browser indicated an orphan tab with no windowId');
        }
        await this.updateWindow(tab.windowId, { focused: true });
    }

    public sendMessageToTab(tabId: number, message: any): Promise<void> {
        return browser.tabs.sendMessage(tabId, message);
    }

    public sendMessageToFrames(message: any): Promise<void> {
        return browser.runtime.sendMessage(message);
    }

    public async sendRuntimeMessage(message: any): Promise<any> {
        return await browser.runtime.sendMessage(message);
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

    public getRuntimeLastError(): chrome.runtime.LastError | undefined {
        return chrome.runtime.lastError;
    }

    public createNotification(options: Notifications.CreateNotificationOptions): Promise<string> {
        return browser.notifications.create(options);
    }

    public isAllowedFileSchemeAccess(): Promise<boolean> {
        return browser.extension.isAllowedFileSchemeAccess();
    }

    public addCommandListener(callback: (command: string) => void): void {
        this.browserEventManager.addApplicationListener('CommandsOnCommand', callback);
    }

    public getCommands(callback: (commands: chrome.commands.Command[]) => void): void {
        chrome.commands.getAll(callback);
    }

    public addListenerOnMessage(
        callback: (message: any, sender: Runtime.MessageSender) => void | Promise<any>,
    ): void {
        this.browserEventManager.addApplicationListener('RuntimeOnMessage', callback);
    }

    public removeListenersOnMessage(): void {
        this.browserEventManager.removeListeners(browser.runtime.onMessage, 'RuntimeOnMessage');
    }

    public getManifest(): chrome.runtime.Manifest {
        return chrome.runtime.getManifest();
    }

    public getExtensionId(): string | undefined {
        // The webextension typings lie; it *is* possible for this to be
        // undefined if queried from a content script of a disabled extension
        return browser.runtime.id;
    }

    public getVersion(): string {
        return this.getManifest().version;
    }

    public getUrl(urlPart: string): string {
        return browser.runtime.getURL(urlPart);
    }

    public requestPermissions(permissions: Permissions.Permissions): Promise<boolean> {
        return browser.permissions.request(permissions);
    }

    public addListenerOnPermissionsAdded(
        callback: (permissions: Permissions.Permissions) => void,
    ): void {
        this.browserEventManager.addApplicationListener('PermissionsOnAdded', callback);
    }

    public addListenerOnPermissionsRemoved(
        callback: (permissions: Permissions.Permissions) => void,
    ): void {
        this.browserEventManager.addApplicationListener('PermissionsOnRemoved', callback);
    }

    public containsPermissions(permissions: Permissions.Permissions): Promise<boolean> {
        return browser.permissions.contains(permissions);
    }

    public getInspectedWindowTabId(): number {
        return chrome.devtools.inspectedWindow.tabId;
    }
}
