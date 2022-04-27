// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BrowserAdapter } from '../common/browser-adapters/browser-adapter';
import { Message } from '../common/message';
import { BrowserMessageBroadcasterFactory } from './browser-message-broadcaster-factory';
import { ExtensionDetailsViewController } from './extension-details-view-controller';
import { TabToContextMap } from './tab-context';
import { TabContextFactory } from './tab-context-factory';

export class TabContextManager {
    constructor(
        private readonly targetPageTabIdToContextMap: TabToContextMap,
        private readonly broadcasterFactory: BrowserMessageBroadcasterFactory,
        private readonly browserAdapter: BrowserAdapter,
        private readonly detailsViewController: ExtensionDetailsViewController,
        private readonly tabContextFactory: TabContextFactory,
        private persistStoreData = false,
    ) {}

    public addTabContextIfNotExists(tabId: number): void {
        if (this.targetPageTabIdToContextMap[tabId] === undefined) {
            this.targetPageTabIdToContextMap[tabId] = this.tabContextFactory.createTabContext(
                this.broadcasterFactory.createTabSpecificBroadcaster(tabId),
                this.browserAdapter,
                this.detailsViewController,
                tabId,
                this.persistStoreData,
            );
        }
    }

    public async deleteTabContext(tabId: number): Promise<void> {
        const tabContext = this.targetPageTabIdToContextMap[tabId];
        if (tabContext) {
            delete this.targetPageTabIdToContextMap[tabId];
            await tabContext.teardown();
        }
    }

    public interpretMessageForTab(tabId: number, message: Message): void {
        const tabContext = this.targetPageTabIdToContextMap[tabId];
        if (tabContext) {
            const interpreter = tabContext.interpreter;
            interpreter.interpret(message);
        }
    }
}
