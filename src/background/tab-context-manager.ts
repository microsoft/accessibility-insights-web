// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { TabContextStoreHub } from 'background/stores/tab-context-store-hub';
import { TabContextFactory } from 'background/tab-context-factory';
import { InterpreterResponse, Message } from '../common/message';
import { TabToContextMap } from './tab-context';

export class TabContextManager {
    constructor(private readonly targetPageTabIdToContextMap: TabToContextMap = {}) {}

    public addTabContextIfNotExists(tabId: number, tabContextFactory: TabContextFactory): void {
        if (!(tabId in this.targetPageTabIdToContextMap)) {
            const tabContext = tabContextFactory.createTabContext(tabId);
            this.targetPageTabIdToContextMap[tabId] = tabContext;
        }
    }

    public async deleteTabContext(tabId: number): Promise<void> {
        if (tabId in this.targetPageTabIdToContextMap) {
            const tabContext = this.targetPageTabIdToContextMap[tabId];
            delete this.targetPageTabIdToContextMap[tabId];
            await tabContext?.teardown();
        }
    }

    public readonly interpretMessageForTab = (
        tabId: number,
        message: Message,
    ): InterpreterResponse => {
        const tabContext = this.targetPageTabIdToContextMap[tabId];
        if (tabContext) {
            const interpreter = tabContext.interpreter;

            return interpreter.interpret(message);
        }

        return { messageHandled: false };
    };

    public getTabContextStores(tabId: number): TabContextStoreHub | undefined {
        return this.targetPageTabIdToContextMap[tabId]?.stores;
    }
}
