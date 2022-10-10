// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { DevToolActions } from 'background/actions/dev-tools-actions';
import { Interpreter } from 'background/interpreter';
import { BrowserAdapter } from 'common/browser-adapters/browser-adapter';
import { Messages } from 'common/messages';
import { PromiseFactory, TimeoutError } from 'common/promises/promise-factory';
import { DevToolsStatusResponse } from 'common/types/dev-tools-messages';

export class DevToolsMonitor {
    private monitorIsActive: boolean = false;
    private failedPingCount = 0;

    constructor(
        private readonly tabId: number,
        private readonly browserAdapter: BrowserAdapter,
        private readonly promiseFactory: PromiseFactory,
        private readonly interpreter: Interpreter,
        private readonly devtoolActions: DevToolActions,
        private readonly messageTimeoutMilliseconds = 500,
        private readonly pollIntervalMilliseconds = 500,
        private readonly maxFailedPings = 3,
    ) {}

    public initialize(): void {
        this.devtoolActions.setDevToolState.addListener(this.onSetDevtoolState);
        this.startMonitor();
    }

    private onSetDevtoolState = async (status: boolean) => {
        if (status) {
            this.startMonitor();
        }
    };

    private startMonitor(): void {
        if (!this.monitorIsActive) {
            // Do not await, we want the polling loop to run asynchronously
            void this.pollUntilClosed();
        }
    }

    protected async pollUntilClosed(): Promise<void> {
        this.monitorIsActive = true;

        while ((await this.isDevtoolOpen()) === true) {
            await this.promiseFactory.delay(null, this.pollIntervalMilliseconds);
        }

        this.monitorIsActive = false;
        await this.onDevtoolClosed();
    }

    private async isDevtoolOpen(): Promise<boolean> {
        try {
            const statusResponse: DevToolsStatusResponse = await this.promiseFactory.timeout(
                this.browserAdapter.sendRuntimeMessage({
                    messageType: Messages.DevTools.StatusRequest,
                    tabId: this.tabId,
                }),
                this.messageTimeoutMilliseconds,
            );

            this.failedPingCount = 0;

            return statusResponse?.isActive === true;
        } catch (e) {
            if (e instanceof TimeoutError || e.message.includes('Could not establish connection')) {
                this.failedPingCount += 1;
                if (this.failedPingCount >= this.maxFailedPings) {
                    return false;
                } else {
                    return true;
                }
            }
            throw e;
        }
    }

    private async onDevtoolClosed(): Promise<void> {
        const response = this.interpreter.interpret({
            tabId: this.tabId,
            messageType: Messages.DevTools.Closed,
        });
        await response.result;
    }
}
