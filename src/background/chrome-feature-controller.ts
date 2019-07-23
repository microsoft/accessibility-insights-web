// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BrowserAdapter } from './browser-adapters/browser-adapter';

export class ChromeShortcutsPageController {
    public static configureCommandTabUrl: string = 'chrome://extensions/shortcuts';

    constructor(private readonly browserAdapter: BrowserAdapter) {}

    public openShortcutsTab(): void {
        this.browserAdapter.createTab(ChromeShortcutsPageController.configureCommandTabUrl);
    }
}
