// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ChromeAdapter, BrowserAdapter } from './browser-adapter';
export interface IDevToolsChromeAdapter extends BrowserAdapter {
    getInspectedWindowTabId(): number;
    executeScriptInInspectedWindow(script: string, frameUrl: string): void;
}

export class DevToolsChromeAdapter extends ChromeAdapter {
    public getInspectedWindowTabId(): number {
        return chrome.devtools.inspectedWindow.tabId;
    }

    public executeScriptInInspectedWindow(script: string, frameUrl: string): void {
        chrome.devtools.inspectedWindow.eval(script, { frameURL: frameUrl } as any);
    }
}
