// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BrowserEventManager } from 'common/browser-adapters/browser-event-manager';
import { ChromiumAdapter } from 'common/browser-adapters/chromium-adapter';
import { FirefoxAdapter } from 'common/browser-adapters/firefox-adapter';
import { WebExtensionBrowserAdapter } from 'common/browser-adapters/webextension-browser-adapter';
import * as UAParser from 'ua-parser-js';

export class BrowserAdapterFactory {
    public constructor(private readonly uaParser: UAParser) {}

    public makeFromUserAgent(
        browserEventManager: BrowserEventManager,
        initialize: boolean = true,
    ): WebExtensionBrowserAdapter {
        let adapter;
        if (this.uaParser.getEngine().name === 'Gecko') {
            adapter = new FirefoxAdapter(browserEventManager);
        } else {
            adapter = new ChromiumAdapter(browserEventManager);
        }
        if (initialize) {
            adapter.initialize();
        }
        return adapter;
    }
}
