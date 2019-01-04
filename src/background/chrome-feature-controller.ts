// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IChromeAdapter } from './browser-adapter';

export class ChromeFeatureController {
    public static configureCommandTabUrl: string = 'chrome://extensions/configureCommands';
    private _browserAdapter: IChromeAdapter;

    constructor(adapter: IChromeAdapter) {
        this._browserAdapter = adapter;
    }

    public openCommandConfigureTab(): void {
        this._browserAdapter.createTab(ChromeFeatureController.configureCommandTabUrl);
    }
}
