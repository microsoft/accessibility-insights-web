// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BrowserEventManager } from 'common/browser-adapters/browser-event-manager';
import { ChromiumAdapter } from 'common/browser-adapters/chromium-adapter';
import { FirefoxAdapter } from 'common/browser-adapters/firefox-adapter';
import { WebExtensionBrowserAdapter } from 'common/browser-adapters/webextension-browser-adapter';
import { DictionaryStringTo } from 'types/common-types';
import * as UAParser from 'ua-parser-js';
import browser, { Events } from 'webextension-polyfill';

export class BrowserAdapterFactory {
    public constructor(private readonly uaParser: UAParser) {}

    public makeFromUserAgent(browserEventManager: BrowserEventManager): WebExtensionBrowserAdapter {
        const browserEvents = this.getDefaultBrowserEvents();

        if (this.uaParser.getEngine().name === 'Gecko') {
            return new FirefoxAdapter(browserEventManager, browserEvents);
        } else {
            return new ChromiumAdapter(browserEventManager, browserEvents);
        }
    }

    protected getDefaultBrowserEvents(): DictionaryStringTo<Events.Event<any>> {
        const browserEvents: DictionaryStringTo<Events.Event<any>> = {
            TabsOnActivated: chrome.tabs?.onActivated,
            TabsOnUpdated: chrome.tabs?.onUpdated,
            TabsOnRemoved: chrome.tabs?.onRemoved,
            WebNavigationOnDOMContentLoaded: chrome.webNavigation?.onDOMContentLoaded,
            WindowsOnFocusChanged: chrome.windows?.onFocusChanged,
            CommandsOnCommand: chrome.commands?.onCommand,
            RuntimeOnConnect: chrome.runtime.onConnect,
            RuntimeOnMessage: browser.runtime.onMessage,
            // casting browser as any due to typings for permissions onAdded not currently supported.
            PermissionsOnAdded: (browser as any).permissions?.onAdded,
            // casting browser as any due to typings for permissions onRemoved not currently supported.
            PermissionsOnRemoved: (browser as any).permissions?.onRemoved,
        };
        return browserEvents;
    }
}
