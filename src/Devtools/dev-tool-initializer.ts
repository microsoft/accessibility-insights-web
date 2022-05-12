// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BrowserAdapter } from 'common/browser-adapters/browser-adapter';
import { StoreUpdateMessageHub } from 'common/store-update-message-hub';
import { DevToolsMessageDistributor } from 'Devtools/dev-tool-message-distributor';
import { TargetPageInspector } from 'Devtools/target-page-inspector';
import { StoreProxy } from '../common/store-proxy';
import { StoreNames } from '../common/stores/store-names';
import { DevToolStoreData } from '../common/types/store-data/dev-tool-store-data';
import { InspectHandler } from './inspect-handler';

export class DevToolInitializer {
    constructor(
        private readonly browserAdapter: BrowserAdapter,
        private readonly targetPageInspector: TargetPageInspector,
    ) {}

    public initialize(): void {
        const storeUpdateMessageHub = new StoreUpdateMessageHub();

        const devtoolsStore = new StoreProxy<DevToolStoreData>(
            StoreNames[StoreNames.DevToolsStore],
            storeUpdateMessageHub,
        );

        const messageDistributor = new DevToolsMessageDistributor(
            this.browserAdapter,
            storeUpdateMessageHub,
        );
        messageDistributor.initialize();

        const inspectHandler = new InspectHandler(
            devtoolsStore,
            this.browserAdapter,
            this.targetPageInspector,
        );

        inspectHandler.initialize();
    }
}
