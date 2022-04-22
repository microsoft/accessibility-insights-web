// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BrowserAdapter } from 'common/browser-adapters/browser-adapter';
import { Logger } from 'common/logging/logger';
import { StoreUpdateMessageDistributor } from 'common/store-update-message-distributor';
import { TargetPageInspector } from 'Devtools/target-page-inspector';
import { StoreProxy } from '../common/store-proxy';
import { StoreNames } from '../common/stores/store-names';
import { DevToolStoreData } from '../common/types/store-data/dev-tool-store-data';
import { InspectHandler } from './inspect-handler';

export class DevToolInitializer {
    constructor(
        private readonly browserAdapter: BrowserAdapter,
        private readonly targetPageInspector: TargetPageInspector,
        private readonly logger: Logger,
    ) {}

    public initialize(): void {
        const storeUpdateMessageDistributor = new StoreUpdateMessageDistributor(
            this.browserAdapter,
            this.logger,
        );
        storeUpdateMessageDistributor.initialize();

        const devtoolsStore = new StoreProxy<DevToolStoreData>(
            StoreNames[StoreNames.DevToolsStore],
            storeUpdateMessageDistributor,
        );

        const inspectHandler = new InspectHandler(
            devtoolsStore,
            this.browserAdapter,
            this.targetPageInspector,
        );

        inspectHandler.initialize();
    }
}
