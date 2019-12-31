// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DevToolsChromeAdapter } from 'background/dev-tools-chrome-adapter';
import { StoreProxy } from '../common/store-proxy';
import { StoreNames } from '../common/stores/store-names';
import { DevToolStoreData } from '../common/types/store-data/idev-tool-state';
import { InspectHandler } from './inspect-handler';

export class DevToolInitializer {
    protected devToolsChromeAdapter: DevToolsChromeAdapter;

    constructor(devToolsChromeAdapter: DevToolsChromeAdapter) {
        this.devToolsChromeAdapter = devToolsChromeAdapter;
    }

    public initialize(): void {
        const devtoolsStore = new StoreProxy<DevToolStoreData>(StoreNames[StoreNames.DevToolsStore], this.devToolsChromeAdapter);
        const inspectHandler = new InspectHandler(devtoolsStore, this.devToolsChromeAdapter);

        inspectHandler.initialize();
    }
}
