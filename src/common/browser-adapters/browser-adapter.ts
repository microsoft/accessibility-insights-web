// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    ExtensionTypes,
    Notifications,
    Permissions,
    Runtime,
    Tabs,
    Windows,
} from 'webextension-polyfill-ts';

export interface BrowserAdapter {
    getAllWindows(getInfo: Windows.GetAllGetInfoType): Promise<Windows.Window[]>;
    addListenerToTabsOnActivated(callback: (activeInfo: chrome.tabs.TabActiveInfo) => void): void;
    addListenerToTabsOnUpdated(
        callback: (
            tabId: number,
            changeInfo: chrome.tabs.TabChangeInfo,
            tab: chrome.tabs.Tab,
        ) => void,
    ): void;
    addListenerToTabsOnRemoved(
        callback: (tabId: number, removeInfo: chrome.tabs.TabRemoveInfo) => void,
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
    getTab(tabId: number, onResolve: (tab: chrome.tabs.Tab) => void, onReject?: () => void): void;
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
    addListenerOnConnect(callback: (port: chrome.runtime.Port) => void): void;
    addListenerOnMessage(
        callback: (message: any, sender: Runtime.MessageSender) => void | Promise<any>,
    ): void;

    removeListenerOnMessage(
        callback: (message: any, sender: Runtime.MessageSender) => void | Promise<any>,
    ): void;
    connect(connectionInfo?: chrome.runtime.ConnectInfo): chrome.runtime.Port;
    getManifest(): chrome.runtime.Manifest;

    getUrl(urlPart: string): string;
    requestPermissions(permissions: Permissions.Permissions): Promise<boolean>;
    addListenerOnPermissionsAdded(callback: (permissions: Permissions.Permissions) => void): void;
    addListenerOnPermissionsRemoved(callback: (permissions: Permissions.Permissions) => void): void;
    containsPermissions(permissions: Permissions.Permissions): Promise<boolean>;

    getInspectedWindowTabId(): number;
}
