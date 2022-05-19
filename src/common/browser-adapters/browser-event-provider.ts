// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DictionaryStringTo } from 'types/common-types';
import browser, { Events } from 'webextension-polyfill';

export class BrowserEventProvider {
    public getBackgroundBrowserEvents(): DictionaryStringTo<Events.Event<any>> {
        const browserEvents: DictionaryStringTo<Events.Event<any>> = {
            TabsOnActivated: chrome.tabs.onActivated,
            TabsOnUpdated: chrome.tabs.onUpdated,
            TabsOnRemoved: chrome.tabs.onRemoved,
            WebNavigationOnDOMContentLoaded: chrome.webNavigation.onDOMContentLoaded,
            WindowsOnFocusChanged: chrome.windows.onFocusChanged,
            CommandsOnCommand: chrome.commands.onCommand,
            RuntimeOnMessage: browser.runtime.onMessage,
            // casting browser as any due to typings for permissions onAdded not currently supported.
            PermissionsOnAdded: (browser as any).permissions.onAdded,
            // casting browser as any due to typings for permissions onRemoved not currently supported.
            PermissionsOnRemoved: (browser as any).permissions.onRemoved,
        };
        return browserEvents;
    }

    public getMinimalBrowserEvents(): DictionaryStringTo<Events.Event<any>> {
        const browserEvents: DictionaryStringTo<Events.Event<any>> = {
            RuntimeOnMessage: browser.runtime.onMessage,
        };
        return browserEvents;
    }
}
