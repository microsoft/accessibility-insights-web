// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    ApplicationListener,
    BrowserEventManager,
} from 'common/browser-adapters/browser-event-manager';
import {
    BrowserMessageHandler,
    makeRawBrowserMessageHandler,
} from 'common/browser-adapters/browser-message-handler';
import { DictionaryStringTo } from 'types/common-types';
import browser, { Events, Notifications, Permissions, Tabs, Windows } from 'webextension-polyfill';

import { BrowserAdapter } from './browser-adapter';
import { CommandsAdapter } from './commands-adapter';
import { StorageAdapter } from './storage-adapter';
export abstract class WebExtensionBrowserAdapter
    implements BrowserAdapter, StorageAdapter, CommandsAdapter
{
    constructor(private readonly browserEventManager: BrowserEventManager) {}

    public abstract getManageExtensionUrl(): string;

    public allSupportedEvents(): DictionaryStringTo<Events.Event<any>> {
        return {
            // This is supported in all contexts we can use a BrowserAdapter from
            RuntimeOnMessage: browser.runtime.onMessage,

            // These are only supported from some contexts
            // Particularly, none of these are supported in an injected content script
            TabsOnActivated: browser.tabs?.onActivated,
            TabsOnUpdated: browser.tabs?.onUpdated,
            TabsOnRemoved: browser.tabs?.onRemoved,
            WebNavigationOnDOMContentLoaded: browser.webNavigation?.onDOMContentLoaded,
            WindowsOnFocusChanged: browser.windows?.onFocusChanged,
            CommandsOnCommand: browser.commands?.onCommand,
            PermissionsOnAdded: browser.permissions?.onAdded,
            PermissionsOnRemoved: browser.permissions?.onRemoved,
        };
    }

    public async getAllWindows(getInfo: Windows.GetAllGetInfoType): Promise<Windows.Window[]> {
        return await browser.windows.getAll(getInfo);
    }

    public addListenerToTabsOnActivated(
        callback: (activeInfo: chrome.tabs.TabActiveInfo) => void,
    ): void {
        this.addListener('TabsOnActivated', callback);
    }

    public addListenerToTabsOnUpdated(
        callback: (
            tabId: number,
            changeInfo: chrome.tabs.TabChangeInfo,
            tab: chrome.tabs.Tab,
        ) => void,
    ): void {
        this.addListener('TabsOnUpdated', callback);
    }

    public addListenerToWebNavigationUpdated(
        callback: (details: chrome.webNavigation.WebNavigationFramedCallbackDetails) => void,
    ): void {
        this.addListener('WebNavigationOnDOMContentLoaded', callback);
    }

    public addListenerToTabsOnRemoved(
        callback: (tabId: number, removeInfo: chrome.tabs.TabRemoveInfo) => void,
    ): void {
        this.addListener('TabsOnRemoved', callback);
    }

    public addListenerOnWindowsFocusChanged(callback: (windowId: number) => void): void {
        this.addListener('WindowsOnFocusChanged', callback);
    }

    public async tabsQuery(query: Tabs.QueryQueryInfoType): Promise<Tabs.Tab[]> {
        return await browser.tabs.query(query);
    }

    public async getTab(tabId: number): Promise<Tabs.Tab> {
        return await browser.tabs.get(tabId);
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

    public async executeScriptInTab(
        tabId: number,
        details: {
            file: string;
            allFrames?: boolean | undefined;
        },
    ): Promise<any[]> {
        this.verifyPathCompatibility(details.file);
        return typeof browser.tabs.executeScript === 'function'
            ? await browser.tabs.executeScript(tabId, details)
            : await chrome.scripting.executeScript({
                  target: { tabId, allFrames: details.allFrames },
                  files: [details.file],
              });
    }

    public async insertCSSInTab(
        tabId: number,
        details: {
            file: string;
            allFrames?: boolean | undefined;
        },
    ): Promise<void> {
        this.verifyPathCompatibility(details.file);
        return typeof browser.tabs.insertCSS === 'function'
            ? await browser.tabs.insertCSS(tabId, details)
            : await chrome.scripting.insertCSS({
                  target: { tabId, allFrames: details.allFrames },
                  files: [details.file],
              });
    }

    public async createActiveTab(url: string): Promise<Tabs.Tab> {
        return await browser.tabs.create({ url, active: true, pinned: false });
    }

    public async createTabInNewWindow(url: string): Promise<Tabs.Tab> {
        const newWindow = await browser.windows.create({ url, focused: true });
        if (newWindow.tabs == null) {
            throw new Error('Browser created a window with no tabs');
        }
        return newWindow.tabs[0];
    }

    public async updateTab(
        tabId: number,
        updateProperties: Tabs.UpdateUpdatePropertiesType,
    ): Promise<Tabs.Tab> {
        return await browser.tabs.update(tabId, updateProperties);
    }

    public async updateWindow(
        windowId: number,
        updateProperties: Windows.UpdateUpdateInfoType,
    ): Promise<Windows.Window> {
        return await browser.windows.update(windowId, updateProperties);
    }

    public async switchToTab(tabId: number): Promise<void> {
        const tab = await this.updateTab(tabId, { active: true });
        if (tab.windowId == null) {
            throw new Error('Browser indicated an orphan tab with no windowId');
        }
        await this.updateWindow(tab.windowId, { focused: true });
    }

    public async sendMessageToTab(tabId: number, message: any): Promise<void> {
        return await browser.tabs.sendMessage(tabId, message);
    }

    public async sendMessageToFrames(message: any): Promise<void> {
        return await browser.runtime.sendMessage(message);
    }

    public async sendRuntimeMessage(message: any): Promise<any> {
        return await browser.runtime.sendMessage(message);
    }

    public async setUserData(items: Object): Promise<void> {
        return await browser.storage.local.set(items);
    }

    public async getUserData(keys: string[]): Promise<{ [key: string]: any }> {
        return await browser.storage.local.get(keys);
    }

    public async removeUserData(key: string): Promise<void> {
        return await browser.storage.local.remove(key);
    }

    public getRuntimeLastError(): chrome.runtime.LastError | undefined {
        return chrome.runtime.lastError;
    }

    public async createNotification(
        options: Notifications.CreateNotificationOptions,
    ): Promise<string> {
        return await browser.notifications.create(options);
    }

    public async isAllowedFileSchemeAccess(): Promise<boolean> {
        return await browser.extension.isAllowedFileSchemeAccess();
    }

    public addCommandListener(callback: (command: string) => void): void {
        this.addListener('CommandsOnCommand', callback);
    }

    public async getCommands(): Promise<chrome.commands.Command[]> {
        return new Promise((resolve, reject) => {
            chrome.commands.getAll(commands => resolve(commands));
        });
    }

    public addListenerOnRuntimeMessage(callback: BrowserMessageHandler): void {
        this.addListener('RuntimeOnMessage', makeRawBrowserMessageHandler(callback));
    }

    public removeListenersOnMessage(): void {
        this.browserEventManager.removeListeners('RuntimeOnMessage', browser.runtime.onMessage);
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

    public async requestPermissions(permissions: Permissions.Permissions): Promise<boolean> {
        return await browser.permissions.request(permissions);
    }

    public addListenerOnPermissionsAdded(
        callback: (permissions: Permissions.Permissions) => void,
    ): void {
        this.addListener('PermissionsOnAdded', callback);
    }

    public addListenerOnPermissionsRemoved(
        callback: (permissions: Permissions.Permissions) => void,
    ): void {
        this.addListener('PermissionsOnRemoved', callback);
    }

    public async containsPermissions(permissions: Permissions.Permissions): Promise<boolean> {
        return await browser.permissions.contains(permissions);
    }

    public getInspectedWindowTabId(): number | null {
        return chrome.devtools.inspectedWindow?.tabId;
    }

    private addListener(eventName: string, callback: ApplicationListener): void {
        this.browserEventManager.addApplicationListener(
            eventName,
            this.allSupportedEvents()[eventName],
            callback,
        );
    }
}
