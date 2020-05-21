// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { WebextensionBrowserAdapter } from 'common/browser-adapters/webextension-browser-adapter';
import { browser, Tabs } from 'webextension-polyfill-ts';

export class FirefoxAdapter extends WebextensionBrowserAdapter {
    public getManageExtensionUrl(): string {
        return 'about:addons';
    }

    // Firefox will fail window creation requests with the "focused" property
    public createTabInNewWindow(url: string): Promise<Tabs.Tab> {
        return browser.windows.create({ url }).then(window => window.tabs[0]);
    }
}
