// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Message } from '../common/message';
import { TabContext, TabToContextMap } from './tab-context';

export class TabContextManager {
    constructor(private readonly targetPageTabIdToContextMap: TabToContextMap) {}

    public addTabContextIfNotExists(tabId: number, tabContext: TabContext): void {
        if (this.targetPageTabIdToContextMap[tabId] === undefined) {
            this.targetPageTabIdToContextMap[tabId] = tabContext;
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
