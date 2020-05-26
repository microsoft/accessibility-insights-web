// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { WebExtensionBrowserAdapter } from 'common/browser-adapters/webextension-browser-adapter';

export class ChromiumAdapter extends WebExtensionBrowserAdapter {
    public getManageExtensionUrl(): string {
        return `chrome://extensions/?id=${chrome.runtime.id}`;
    }
}
