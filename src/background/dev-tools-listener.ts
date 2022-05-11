// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DevToolsMonitor } from 'background/dev-tools-monitor';
import { TabContextManager } from 'background/tab-context-manager';
import { DevToolsOpenMessage } from 'common/types/dev-tools-messages';
import { BrowserAdapter } from '../common/browser-adapters/browser-adapter';
import { ConnectionNames } from '../common/constants/connection-names';
import { Messages } from '../common/messages';

export interface PortWithTabId extends chrome.runtime.Port {
    targetPageTabId: number;
}

export class DevToolsListener {
    constructor(
        private readonly tabContextManager: TabContextManager,
        private readonly browserAdapter: BrowserAdapter,
        private readonly devToolsMonitor: DevToolsMonitor,
    ) {}

    public initialize(): void {
        this.browserAdapter.addListenerOnConnect((devToolsConnection: PortWithTabId) => {
            if (devToolsConnection.name === ConnectionNames.devTools) {
                const devToolsListener = (
                    message: DevToolsOpenMessage,
                    port: chrome.runtime.Port,
                ) => {
                    devToolsConnection.targetPageTabId = message.tabId;
                    this.sendDevToolOpened(devToolsConnection);
                    this.devToolsMonitor.startMonitoringDevtool(message.tabId);
                };

                devToolsConnection.onMessage.addListener(devToolsListener);

                devToolsConnection.onDisconnect.addListener(() => {
                    this.sendDevToolClosed(devToolsConnection);

                    devToolsConnection.onMessage.removeListener(devToolsListener);
                });
            }
        });
    }

    private sendDevToolOpened(devToolsConnection: PortWithTabId): void {
        const tabId = devToolsConnection.targetPageTabId;
        this.tabContextManager.interpretMessageForTab(tabId, {
            tabId: tabId,
            messageType: Messages.DevTools.Opened,
        });
    }

    private sendDevToolClosed(devToolsConnection: PortWithTabId): void {
        const tabId = devToolsConnection.targetPageTabId;
        this.tabContextManager.interpretMessageForTab(tabId, {
            tabId: tabId,
            messageType: Messages.DevTools.Closed,
        });
    }
}
