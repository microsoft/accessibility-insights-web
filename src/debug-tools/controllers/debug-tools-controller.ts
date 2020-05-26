// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BrowserAdapter } from 'common/browser-adapters/browser-adapter';

export const debugToolUrl = '/debug-tools/debug-tools.html';

export class DebugToolsController {
    constructor(private readonly browserAdapter: BrowserAdapter) {}

    public async showDebugTools(): Promise<void> {
        await this.browserAdapter.createTabInNewWindow(debugToolUrl);
    }
}
