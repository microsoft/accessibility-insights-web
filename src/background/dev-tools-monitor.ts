// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { IndexedDBDataKeys } from 'background/IndexedDBDataKeys';
import { BrowserAdapter } from 'common/browser-adapters/browser-adapter';
import { IndexedDBAPI } from 'common/indexedDB/indexedDB';
import { Message } from 'common/message';
import { Messages } from 'common/messages';
import { PromiseFactory, TimeoutError } from 'common/promises/promise-factory';
import { DevToolsStatusResponse } from 'common/types/dev-tools-messages';
import { isNil } from 'lodash';

export class DevToolsMonitor {
    private monitorIsActive = false;

    constructor(
        private readonly browserAdapter: BrowserAdapter,
        private readonly promiseFactory: PromiseFactory,
        protected readonly activeDevtoolTabIds: number[],
        private readonly interpretMessageForTab: (tabId: number, message: Message) => void,
        private readonly idbInstance: IndexedDBAPI,
        private persistStoreData: boolean,
        private readonly messageTimeoutMilliseconds = 500,
        private readonly pollIntervalMilliseconds = 500,
    ) {}

    public initialize(): void {
        this.activeDevtoolTabIds.forEach(tabId => {
            this.startMonitoringDevtool(tabId);
        });
    }

    public async startMonitoringDevtool(tabId: number): Promise<void> {
        await this.addActiveDevtool(tabId);

        if (!this.monitorIsActive) {
            // Do not await, we want to continue running other synchronous code
            this.monitorActiveDevtools();
        }
    }

    private async addActiveDevtool(tabId: number): Promise<void> {
        if (!isNil(tabId) && !this.activeDevtoolTabIds.includes(tabId)) {
            this.activeDevtoolTabIds.push(tabId);
            if (this.persistStoreData) {
                await this.idbInstance.setItem(
                    IndexedDBDataKeys.activeDevtoolTabIds,
                    this.activeDevtoolTabIds,
                );
            }
        }
    }

    private async removeActiveDevtool(tabId: number): Promise<void> {
        const index = this.activeDevtoolTabIds.indexOf(tabId);
        if (index >= 0) {
            this.activeDevtoolTabIds.splice(index, 1);
            if (this.persistStoreData) {
                this.idbInstance.setItem(
                    IndexedDBDataKeys.activeDevtoolTabIds,
                    this.activeDevtoolTabIds,
                );
            }
        }
    }

    protected async monitorActiveDevtools(): Promise<void> {
        this.monitorIsActive = true;

        while (this.activeDevtoolTabIds.length > 0) {
            await this.promiseFactory.delay(null, this.pollIntervalMilliseconds);
            await this.removeInactiveDevtools();
        }

        this.monitorIsActive = false;
    }

    private async removeInactiveDevtools(): Promise<void> {
        const idsToRemove: number[] = [];

        await Promise.all(
            this.activeDevtoolTabIds.map(async tabId => {
                const isOpen = await this.isDevtoolOpen(tabId);
                if (!isOpen) {
                    idsToRemove.push(tabId);
                }
            }),
        );

        await Promise.all(
            idsToRemove.map(async tabId => {
                await this.removeActiveDevtool(tabId);
                this.onDevtoolsClosed(tabId);
            }),
        );
    }

    private async isDevtoolOpen(tabId: number): Promise<boolean> {
        try {
            const statusResponse: DevToolsStatusResponse = await this.promiseFactory.timeout(
                this.browserAdapter.sendRuntimeMessage({
                    messageType: Messages.DevTools.StatusRequest,
                    tabId: tabId,
                }),
                this.messageTimeoutMilliseconds,
            );

            return statusResponse?.isActive === true;
        } catch (e) {
            if (e instanceof TimeoutError || e.message.includes('Could not establish connection')) {
                return false;
            }
            throw e;
        }
    }

    private onDevtoolsClosed(tabId: number): void {
        this.interpretMessageForTab(tabId, {
            tabId: tabId,
            messageType: Messages.DevTools.Closed,
        });
    }
}
