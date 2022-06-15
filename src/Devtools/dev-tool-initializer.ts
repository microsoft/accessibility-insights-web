// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BrowserAdapter } from 'common/browser-adapters/browser-adapter';
import { BrowserMessageDistributor } from 'common/browser-adapters/browser-message-distributor';
import { createDefaultLogger } from 'common/logging/default-logger';
import { RemoteActionMessageDispatcher } from 'common/message-creators/remote-action-message-dispatcher';
import { StoreUpdateMessageHub } from 'common/store-update-message-hub';
import { DevToolsStatusResponder } from 'Devtools/dev-tools-status-responder';
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

    public async initialize(): Promise<void> {
        const inspectedWindowTabId = this.browserAdapter.getInspectedWindowTabId();
        if (inspectedWindowTabId == null) {
            // This means the inspectee is a non-UX context, like a background page or a service
            // worker, where it doesn't make sense for us to run.
            return;
        }

        const logger = createDefaultLogger();

        const actionMessageDispatcher = new RemoteActionMessageDispatcher(
            this.browserAdapter.sendMessageToFrames,
            inspectedWindowTabId,
            logger,
        );

        const devToolsStatusResponder = new DevToolsStatusResponder(this.browserAdapter);
        const storeUpdateMessageHub = new StoreUpdateMessageHub(actionMessageDispatcher);
        const messageDistributor = new BrowserMessageDistributor(this.browserAdapter, [
            devToolsStatusResponder.handleBrowserMessage,
            storeUpdateMessageHub.handleBrowserMessage,
        ]);
        messageDistributor.initialize();

        const devtoolsStore = new StoreProxy<DevToolStoreData>(
            StoreNames[StoreNames.DevToolsStore],
            storeUpdateMessageHub,
        );

        const inspectHandler = new InspectHandler(
            devtoolsStore,
            this.browserAdapter,
            this.targetPageInspector,
        );
        await inspectHandler.initialize();
    }
}
