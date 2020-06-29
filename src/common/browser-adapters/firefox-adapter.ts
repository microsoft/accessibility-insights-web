// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { WebExtensionBrowserAdapter } from 'common/browser-adapters/webextension-browser-adapter';
import { browser, Tabs } from 'webextension-polyfill-ts';

export class FirefoxAdapter extends WebExtensionBrowserAdapter {
    public getManageExtensionUrl(): string {
        return 'about:addons';
    }

    // Firefox will fail window creation requests with the "focused" property
    public async createTabInNewWindow(url: string): Promise<Tabs.Tab> {
        const newWindow = await browser.windows.create({ url });
        if (newWindow.tabs == null) {
            throw new Error('Browser created a window with no tabs');
        }
        return newWindow.tabs[0];
    }
}
