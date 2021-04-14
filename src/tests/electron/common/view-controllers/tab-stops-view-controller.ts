// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { TabStopsViewSelectors } from 'tests/electron/common/element-identifiers/tab-stops-view-selectors';
import { SpectronAsyncClient } from 'tests/electron/common/view-controllers/spectron-async-client';
import { ViewController } from './view-controller';

export class TabStopsViewController extends ViewController {
    constructor(client: SpectronAsyncClient) {
        super(client);
    }

    public async clickToggleTabStops(): Promise<void> {
        await this.waitForSelector(TabStopsViewSelectors.tabStopsToggle);
        await this.client.click(TabStopsViewSelectors.tabStopsToggle);
    }
}
