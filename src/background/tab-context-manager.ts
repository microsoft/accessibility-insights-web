// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { TabContextFactory } from 'background/tab-context-factory';
import { Message } from '../common/message';
import { TabToContextMap } from './tab-context';

export class TabContextManager {
    constructor(private readonly targetPageTabIdToContextMap: TabToContextMap) {}

    public addTabContextIfNotExists(tabId: number, tabContextFactory: TabContextFactory): void {
        if (!(tabId in this.targetPageTabIdToContextMap)) {
            this.targetPageTabIdToContextMap[tabId] = tabContextFactory.createTabContext(tabId);
        }
    }

    public async deleteTabContext(tabId: number): Promise<void> {
        if (tabId in this.targetPageTabIdToContextMap) {
            const tabContext = this.targetPageTabIdToContextMap[tabId];
            delete this.targetPageTabIdToContextMap[tabId];
            await tabContext?.teardown();
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
