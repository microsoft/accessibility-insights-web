// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { createDefaultLogger } from 'common/logging/default-logger';
import { Logger } from 'common/logging/logger';
import { inspect } from 'util';
import { BrowserAdapter } from '../common/browser-adapters/browser-adapter';

export type MessageBroadcaster = (message: any) => Promise<void>;

export class BrowserMessageBroadcasterFactory {
    constructor(
        private readonly browserAdapter: BrowserAdapter,
        private readonly logger: Logger = createDefaultLogger(),
    ) {}

    public allTabsBroadcaster: MessageBroadcaster = async (message: any) => {
        // Ordering sendMessageToFrames before tabsQuery is necessary to prevent the race
        // condition described by #1816
        await this.sendMessageToFrames(message);

        const allTabs: chrome.tabs.Tab[] = await new Promise(resolve => {
            this.browserAdapter.tabsQuery({}, resolve);
        });

        await Promise.all(allTabs.map(tab => this.sendMessageToTab(tab.id, message)));
    };

    public createTabSpecificBroadcaster = (tabId: number): MessageBroadcaster => {
        return message => this.broadcastToTab(tabId, message);
    };

    private broadcastToTab = async (tabId: number, message: any): Promise<void> => {
        message.tabId = tabId;
        await Promise.all([
            this.sendMessageToFrames(message),
            this.sendMessageToTab(tabId, message),
        ]);
    };

    private sendMessageToFrames = async (message: any): Promise<void> => {
        await this.browserAdapter
            .sendMessageToFrames(message)
            .catch(e => this.errorHandler(`sendMessageToFrames`, message, e));
    };

    private sendMessageToTab = async (tabId: number, message: any): Promise<void> => {
        await this.browserAdapter
            .sendMessageToTab(tabId, message)
            .catch(e => this.errorHandler(`sendMessageToTab(${tabId})`, message, e));
    };

    private errorHandler = (
        operationDescription: string,
        message: any,
        chromeError: chrome.runtime.LastError,
    ) => {
        const msg = `${operationDescription} failed for message ${inspect(
            message,
        )} with browser error message: ${chromeError.message}`;
        this.logger.error(msg);
    };
}
