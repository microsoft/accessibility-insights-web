// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { BrowserAdapter } from 'common/browser-adapters/browser-adapter';
import { Messages } from 'common/messages';
import { PromiseFactory, TimeoutError } from 'common/promises/promise-factory';
import { DevToolsStatusResponse } from 'common/types/dev-tools-messages';
import _ from 'lodash';

export class DevToolsMonitor {
    constructor(
        private readonly browserAdapter: BrowserAdapter,
        private readonly promiseFactory: PromiseFactory,
        private readonly activeDevtoolTabIds: number[],
        private readonly messageTimeoutMilliseconds = 5000,
        private readonly pollIntervalMilliseconds = 1000,
    ) {}

    public initialize() {
        // TODO: initialize with persisted activeDevtoolTabIds, start monitor if needed
    }

    public monitorActiveDevtool(tabId: number): void {
        this.addActiveDevtool(tabId);

        if (this.activeDevtoolTabIds.length === 1) {
            // Do not await, we want to continue running other synchronous code
            this.waitForAllDevtoolsClosed();
        }
    }

    private addActiveDevtool(tabId: number): void {
        if (!_.isNil(tabId) && !this.activeDevtoolTabIds.includes(tabId)) {
            this.activeDevtoolTabIds.push(tabId);
        }
        // TODO: persist activeDevtoolTabIds
    }

    private removeActiveDevtool(tabId: number): void {
        const index = this.activeDevtoolTabIds.indexOf(tabId);
        if (index >= 0) {
            this.activeDevtoolTabIds.splice(index, 1);
        }
        // TODO: persist activeDevtoolTabIds
    }

    private async waitForAllDevtoolsClosed(): Promise<void> {
        while (this.activeDevtoolTabIds.length > 0) {
            await this.promiseFactory.delay(null, this.pollIntervalMilliseconds);
            await this.removeInactiveDevtools();
        }
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

        idsToRemove.forEach(tabId => {
            this.removeActiveDevtool(tabId);
            this.onDevtoolsClosed(tabId);
        });
    }

    private async isDevtoolOpen(tabId: number): Promise<boolean> {
        const devtoolStatusPromise = await this.browserAdapter.sendRuntimeMessage({
            messageType: Messages.DevTools.StatusRequest,
            tabId: tabId,
        });

        try {
            const statusResponse: DevToolsStatusResponse = await this.promiseFactory.timeout(
                devtoolStatusPromise,
                this.messageTimeoutMilliseconds,
            );

            return statusResponse?.isActive === true;
        } catch (e) {
            if (e instanceof TimeoutError) {
                return false;
            }
            throw e;
        }
    }

    private onDevtoolsClosed(tabId: number): void {
        // TODO
    }
}
