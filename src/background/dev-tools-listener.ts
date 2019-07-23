// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ConnectionNames } from '../common/constants/connection-names';
import { Messages } from '../common/messages';
import { DevToolsOpenMessage } from '../common/types/dev-tools-open-message';
import { OnDevToolOpenPayload } from './actions/action-payloads';
import { BrowserAdapter } from '../common/browser-adapters/browser-adapter';
import { TabToContextMap } from './tab-context';

export interface PortWithTabId extends chrome.runtime.Port {
    targetPageTabId: number;
}

export class DevToolsListener {
    private _tabIdToContextMap: TabToContextMap;
    private _browserAdapter: BrowserAdapter;

    constructor(tabIdToContextMap: TabToContextMap, browserAdapter: BrowserAdapter) {
        this._tabIdToContextMap = tabIdToContextMap;
        this._browserAdapter = browserAdapter;
    }

    public initialize(): void {
        this._browserAdapter.addListenerOnConnect((devToolsConnection: PortWithTabId) => {
            if (devToolsConnection.name === ConnectionNames.devTools) {
                const devToolsListener = (message: DevToolsOpenMessage, port: chrome.runtime.Port) => {
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
        const tabContext = this._tabIdToContextMap[tabId];

        if (tabContext) {
            tabContext.interpreter.interpret({
                payload: {
                    status: status,
                } as OnDevToolOpenPayload,
                tabId: tabId,
                messageType: Messages.DevTools.DevtoolStatus,
            });
        }
    }
}
