// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DevToolsChromeAdapter } from '../background/dev-tools-chrome-adapter';
import { ConnectionNames } from '../common/constants/connection-names';
import { BaseStore } from '../common/istore';
import { DevToolsOpenMessage } from '../common/types/dev-tools-open-message';
import { DevToolState } from '../common/types/store-data/idev-tool-state';

export class InspectHandler {
    private _devToolsStore: BaseStore<DevToolState>;
    private _devToolsChromeAdapter: DevToolsChromeAdapter;

    constructor(devToolsStore: BaseStore<DevToolState>, devToolsChromeAdapter: DevToolsChromeAdapter) {
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

        backgroundPageConnection.postMessage({ tabId: this._devToolsChromeAdapter.getInspectedWindowTabId() } as DevToolsOpenMessage);
    }
}
