// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BrowserAdapter } from '../common/browser-adapters/browser-adapter';

export class ChromeFeatureController {
    public static configureCommandTabUrl: string = 'chrome://extensions/configureCommands';
    private browserAdapter: BrowserAdapter;

    constructor(adapter: BrowserAdapter) {
        this.browserAdapter = adapter;
    }

    public openCommandConfigureTab(): void {
        this.browserAdapter.createTab(ChromeFeatureController.configureCommandTabUrl);
    }
}
