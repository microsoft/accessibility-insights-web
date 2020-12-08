// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ChromiumAdapter } from 'common/browser-adapters/chromium-adapter';
import { FirefoxAdapter } from 'common/browser-adapters/firefox-adapter';
import { WebExtensionBrowserAdapter } from 'common/browser-adapters/webextension-browser-adapter';
import * as UAParser from 'ua-parser-js';

export class BrowserAdapterFactory {
    public constructor(private readonly uaParser: UAParser) {}

    public makeFromUserAgent(): WebExtensionBrowserAdapter {
        if (this.uaParser.getEngine().name === 'Gecko') {
            return new FirefoxAdapter();
        } else {
            return new ChromiumAdapter();
        }
    }
}
