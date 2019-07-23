// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BrowserAdapter } from '../common/browser-adapters/browser-adapter';

export class ChromeFeatureController {
    public static configureCommandTabUrl: string = 'chrome://extensions/configureCommands';
    private _browserAdapter: BrowserAdapter;

    constructor(adapter: BrowserAdapter) {
        this._browserAdapter = adapter;
    }

    public openCommandConfigureTab(): void {
        this._browserAdapter.createTab(ChromeFeatureController.configureCommandTabUrl);
    }
}
