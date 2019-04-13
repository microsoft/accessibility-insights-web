// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import 'reflect-metadata';

import { injectable } from 'inversify';

import { BrowserAdapter, ChromeAdapter } from './browser-adapter';

export interface DevToolsChromeAdapter extends BrowserAdapter {
    getInspectedWindowTabId(): number;
    executeScriptInInspectedWindow(script: string, frameUrl: string): void;
}

@injectable()
export class DevToolsChromeAdapterImpl extends ChromeAdapter {
    public getInspectedWindowTabId(): number {
        return chrome.devtools.inspectedWindow.tabId;
    }

    public executeScriptInInspectedWindow(script: string, frameUrl: string): void {
        chrome.devtools.inspectedWindow.eval(script, { frameURL: frameUrl } as any);
    }
}
