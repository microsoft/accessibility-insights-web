// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DevToolsChromeAdapter } from 'background/dev-tools-chrome-adapter';
import { BaseStore } from '../common/base-store';
import { ConnectionNames } from '../common/constants/connection-names';
import { DevToolsOpenMessage } from '../common/types/dev-tools-open-message';
import { DevToolStoreData } from '../common/types/store-data/dev-tool-store-data';

export class InspectHandler {
    private devToolsStore: BaseStore<DevToolStoreData>;
    private devToolsChromeAdapter: DevToolsChromeAdapter;

    constructor(devToolsStore: BaseStore<DevToolStoreData>, devToolsChromeAdapter: DevToolsChromeAdapter) {
        this.devToolsStore = devToolsStore;
        this.devToolsChromeAdapter = devToolsChromeAdapter;
    }

    public initialize(): void {
        this.devToolsStore.addChangedListener(() => {
            const state = this.devToolsStore.getState();

            if (state && state.inspectElement && (state.inspectElement.length === 1 || state.frameUrl)) {
                this.devToolsChromeAdapter.executeScriptInInspectedWindow(
                    "inspect(document.querySelector('" + state.inspectElement[state.inspectElement.length - 1] + "'))",
                    state.frameUrl,
                );
            }
        });

        const backgroundPageConnection = this.devToolsChromeAdapter.connect({
            name: ConnectionNames.devTools,
        });

        backgroundPageConnection.postMessage({ tabId: this.devToolsChromeAdapter.getInspectedWindowTabId() } as DevToolsOpenMessage);
    }
}
