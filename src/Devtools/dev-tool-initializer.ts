// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DevToolsChromeAdapter } from 'background/dev-tools-chrome-adapter';
import { TargetPageInspector } from 'Devtools/target-page-inspector';
import { StoreProxy } from '../common/store-proxy';
import { StoreNames } from '../common/stores/store-names';
import { DevToolStoreData } from '../common/types/store-data/dev-tool-store-data';
import { InspectHandler } from './inspect-handler';

export class DevToolInitializer {
    constructor(
        private readonly devToolsChromeAdapter: DevToolsChromeAdapter,
        private readonly targetPageInspector: TargetPageInspector,
    ) {}

    public initialize(): void {
        const devtoolsStore = new StoreProxy<DevToolStoreData>(
            StoreNames[StoreNames.DevToolsStore],
            this.devToolsChromeAdapter,
        );

        const inspectHandler = new InspectHandler(
            devtoolsStore,
            this.devToolsChromeAdapter,
            this.targetPageInspector,
        );

        inspectHandler.initialize();
    }
}
