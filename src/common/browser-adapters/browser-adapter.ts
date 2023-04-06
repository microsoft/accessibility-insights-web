// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BrowserMessageHandler } from 'common/browser-adapters/browser-message-handler';
import { DictionaryStringTo } from 'types/common-types';
import {
    Events,
    ExtensionTypes,
    Notifications,
    Permissions,
    Tabs,
    Windows,
} from 'webextension-polyfill';

export interface BrowserAdapter {
    allSupportedEvents(): DictionaryStringTo<Events.Event<any>>;
    getAllWindows(getInfo: Windows.GetAllGetInfoType): Promise<Windows.Window[]>;
    addListenerToTabsOnActivated(
        callback: (activeInfo: Tabs.OnActivatedActiveInfoType) => void,
    ): void;
    addListenerToTabsOnUpdated(
        callback: (tabId: number, changeInfo: Tabs.OnUpdatedChangeInfoType, tab: Tabs.Tab) => void,
    ): void;
    addListenerToTabsOnRemoved(
        callback: (tabId: number, removeInfo: Tabs.OnRemovedRemoveInfoType) => void,
    ): void;
    addListenerToWebNavigationUpdated(
        callback: (details: chrome.webNavigation.WebNavigationFramedCallbackDetails) => void,
    ): void;
    addListenerOnWindowsFocusChanged(callback: (windowId: number) => void): void;
    tabsQuery(query: Tabs.QueryQueryInfoType): Promise<Tabs.Tab[]>;
    createActiveTab(url: string): Promise<Tabs.Tab>;
    createTabInNewWindow(url: string): Promise<Tabs.Tab>;
    switchToTab(tabId: number): Promise<void>;
    updateTab(tabId: number, updateProperties: Tabs.UpdateUpdatePropertiesType): Promise<Tabs.Tab>;
    getTab(tabId: number): Promise<Tabs.Tab>;
    updateWindow(
        windowId: number,
        updateProperties: Windows.UpdateUpdateInfoType,
    ): Promise<Windows.Window>;
    sendMessageToTab(tabId: number, message: any): Promise<void>;
    sendMessageToFrames(message: any): Promise<void>;
    sendRuntimeMessage(message: any): Promise<any>;
    executeScriptInTab(tabId: number, details: ExtensionTypes.InjectDetails): Promise<any[]>;
    insertCSSInTab(tabId: number, details: ExtensionTypes.InjectDetails): Promise<void>;
    createNotification(options: Notifications.CreateNotificationOptions): Promise<string>;
    getRuntimeLastError(): chrome.runtime.LastError | undefined;
    isAllowedFileSchemeAccess(): Promise<boolean>;
    getManageExtensionUrl(): string;
    addListenerOnRuntimeMessage(callback: BrowserMessageHandler): void;

    removeListenersOnMessage(): void;
    getManifest(): chrome.runtime.Manifest;

    // undefined implies "the extension has been disabled/uninstalled"
    getExtensionId(): string | undefined;

    getUrl(urlPart: string): string;
    requestPermissions(permissions: Permissions.Permissions): Promise<boolean>;
    addListenerOnPermissionsAdded(callback: (permissions: Permissions.Permissions) => void): void;
    addListenerOnPermissionsRemoved(callback: (permissions: Permissions.Permissions) => void): void;
    containsPermissions(permissions: Permissions.Permissions): Promise<boolean>;

    getInspectedWindowTabId(): number | null;
}
