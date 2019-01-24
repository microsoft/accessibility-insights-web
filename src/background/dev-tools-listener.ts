// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IOnDevToolOpenPayload } from './actions/action-payloads';
import { ConnectionNames } from '../common/constants/connection-names';
import { Messages } from '../common/messages';
import { IDevToolsOpenMessage } from '../common/types/dev-tools-open-message';
import { BrowserAdapter } from './browser-adapter';
import { TabToContextMap } from './tab-context';

export interface PortWithTabId extends chrome.runtime.Port {
    targetPageTabId: number;
}

export class DevToolsListener {
    private _tabIdToContextMap: TabToContextMap;
    private _chromeAdapter: BrowserAdapter;

    constructor(tabIdToContextMap: TabToContextMap, chromeAdapter: BrowserAdapter) {
        this._tabIdToContextMap = tabIdToContextMap;
        this._chromeAdapter = chromeAdapter;
    }

    public initialize() {
        this._chromeAdapter.addListenerOnConnect((devToolsConnection: PortWithTabId) => {
            if (devToolsConnection.name === ConnectionNames.devTools) {
                const devToolsListener = (message: IDevToolsOpenMessage, port: chrome.runtime.Port) => {
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

    private sendDevToolStatus(devToolsConnection: PortWithTabId, status: boolean) {
        const tabId = devToolsConnection.targetPageTabId;
        const tabContext = this._tabIdToContextMap[tabId];

        if (tabContext) {
            tabContext.interpreter.interpret({
                payload: {
                    status: status,
                } as IOnDevToolOpenPayload,
                tabId: tabId,
                type: Messages.DevTools.DevtoolStatus,
            });
        }
    }
}
