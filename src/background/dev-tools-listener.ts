// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { TabContextManager } from 'background/tab-context-manager';
import { BrowserAdapter } from '../common/browser-adapters/browser-adapter';
import { ConnectionNames } from '../common/constants/connection-names';
import { Messages } from '../common/messages';
import { DevToolsOpenMessage } from '../common/types/dev-tools-open-message';
import { OnDevToolOpenPayload } from './actions/action-payloads';

export interface PortWithTabId extends chrome.runtime.Port {
    targetPageTabId: number;
}

export class DevToolsListener {
    constructor(
        private readonly tabContextManager: TabContextManager,
        private readonly browserAdapter: BrowserAdapter,
    ) {}

    public initialize(): void {
        this.browserAdapter.addListenerOnConnect((devToolsConnection: PortWithTabId) => {
            if (devToolsConnection.name === ConnectionNames.devTools) {
                const devToolsListener = (
                    message: DevToolsOpenMessage,
                    port: chrome.runtime.Port,
                ) => {
                    devToolsConnection.targetPageTabId = message.tabId;
                    this.sendDevToolStatus(devToolsConnection, true);
                };

                devToolsConnection.onMessage.addListener(devToolsListener);

                devToolsConnection.onDisconnect.addListener(() => {
                    this.sendDevToolStatus(devToolsConnection, false);

                    devToolsConnection.onMessage.removeListener(devToolsListener);
                });
            }
        });
    }

    private sendDevToolStatus(devToolsConnection: PortWithTabId, status: boolean): void {
        const tabId = devToolsConnection.targetPageTabId;
        this.tabContextManager.interpretMessageForTab(tabId, {
            payload: {
                status: status,
            } as OnDevToolOpenPayload,
            tabId: tabId,
            messageType: Messages.DevTools.DevtoolStatus,
        });
    }
}
