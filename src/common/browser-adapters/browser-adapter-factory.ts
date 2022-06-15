// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BrowserEventManager } from 'common/browser-adapters/browser-event-manager';
import { ChromiumAdapter } from 'common/browser-adapters/chromium-adapter';
import { FirefoxAdapter } from 'common/browser-adapters/firefox-adapter';
import { PassthroughBrowserEventManager } from 'common/browser-adapters/passthrough-browser-event-manager';
import { WebExtensionBrowserAdapter } from 'common/browser-adapters/webextension-browser-adapter';
import UAParser from 'ua-parser-js';

export class BrowserAdapterFactory {
    public constructor(private readonly uaParser: UAParser) {}

    public makeFromUserAgent(
        browserEventManager?: BrowserEventManager,
    ): WebExtensionBrowserAdapter {
        if (!browserEventManager) {
            browserEventManager = new PassthroughBrowserEventManager();
        }

        let adapter: WebExtensionBrowserAdapter;
        if (this.uaParser.getEngine().name === 'Gecko') {
            adapter = new FirefoxAdapter(browserEventManager);
        } else {
            adapter = new ChromiumAdapter(browserEventManager);
        }

        return adapter;
    }
}
