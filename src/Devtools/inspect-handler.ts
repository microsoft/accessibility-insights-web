// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IDevToolsChromeAdapter } from '../background/dev-tools-chrome-adapter';
import { ConnectionNames } from '../common/constants/connection-names';
import { IBaseStore } from '../common/istore';
import { IDevToolsOpenMessage } from '../common/types/dev-tools-open-message';
import { DevToolState } from '../common/types/store-data/idev-tool-state';

export class InspectHandler {
    private _devToolsStore: IBaseStore<DevToolState>;
    private _devToolsChromeAdapter: IDevToolsChromeAdapter;

    constructor(devToolsStore: IBaseStore<DevToolState>, devToolsChromeAdapter: IDevToolsChromeAdapter) {
        this._devToolsStore = devToolsStore;
        this._devToolsChromeAdapter = devToolsChromeAdapter;
    }

    public initialize(): void {
        this._devToolsStore.addChangedListener(() => {
            const state = this._devToolsStore.getState();

            if (state && state.inspectElement && (state.inspectElement.length === 1 || state.frameUrl)) {
                this._devToolsChromeAdapter.executeScriptInInspectedWindow(
                    "inspect(document.querySelector('" + state.inspectElement[state.inspectElement.length - 1] + "'))",
                    state.frameUrl,
                );
            }
        });

        const backgroundPageConnection = this._devToolsChromeAdapter.connect({
            name: ConnectionNames.devTools,
        });

        backgroundPageConnection.postMessage({ tabId: this._devToolsChromeAdapter.getInspectedWindowTabId() } as IDevToolsOpenMessage);
    }
}
