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

    constructor(
        private readonly tabId: number,
        private readonly browserAdapter: BrowserAdapter,
        private readonly promiseFactory: PromiseFactory,
        private readonly interpreter: Interpreter,
        private readonly devtoolActions: DevToolActions,
        private readonly messageTimeoutMilliseconds = 500,
        private readonly pollIntervalMilliseconds = 500,
    ) {}

    public initialize(): void {
        this.devtoolActions.setDevToolState.addListener(this.onSetDevtoolState);
        this.startMonitor();
    }

    private onSetDevtoolState = (status: boolean) => {
        if (status) {
            this.startMonitor();
        }
    };

    private startMonitor(): void {
        if (!this.monitorIsActive) {
            // Do not await, we want the polling loop to run asynchronously
            this.pollUntilClosed();
        }
    }

    protected async pollUntilClosed(): Promise<void> {
        this.monitorIsActive = true;

        while ((await this.isDevtoolOpen()) === true) {
            await this.promiseFactory.delay(null, this.pollIntervalMilliseconds);
        }

        this.monitorIsActive = false;
        this.onDevtoolClosed();
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

            return statusResponse?.isActive === true;
        } catch (e) {
            if (e instanceof TimeoutError || e.message.includes('Could not establish connection')) {
                return false;
            }
            throw e;
        }
    }

    private onDevtoolClosed(): void {
        this.interpreter.interpret({
            tabId: this.tabId,
            messageType: Messages.DevTools.Closed,
        });
    }
}
