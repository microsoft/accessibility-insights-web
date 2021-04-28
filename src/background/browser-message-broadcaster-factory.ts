// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { inspect } from 'util';
import { BrowserAdapter } from 'common/browser-adapters/browser-adapter';
import { Logger } from 'common/logging/logger';

export type MessageBroadcaster = (message: any) => Promise<void>;

export const connectionErrorMessage =
    'Could not establish connection. Receiving end does not exist.';

export class BrowserMessageBroadcasterFactory {
    constructor(private readonly browserAdapter: BrowserAdapter, private readonly logger: Logger) {}

    public allTabsBroadcaster: MessageBroadcaster = async (message: any) => {
        // Ordering sendMessageToFrames before tabsQuery is necessary to prevent the race
        // condition described by #1816
        await this.sendMessageToFrames(message);

        const allTabs = await this.browserAdapter.tabsQuery({});

        const sendMessageToTab = async tab => {
            if (tab != null) {
                await this.sendMessageToTab(tab.id, message);
            }
        };

        await Promise.all(allTabs.map(sendMessageToTab));
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
        // We get this message when we have not yet injected our content script on the tab we are
        // sending the message to.
        // Filtering this out (not logging it to the console) to avoid generating meaningless noise
        if (chromeError.message === connectionErrorMessage) {
            return;
        }

        const msg = `${operationDescription} failed for message ${inspect(
            message,
        )} with browser error message: ${chromeError.message}`;
        this.logger.error(msg);
    };
}
