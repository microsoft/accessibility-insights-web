// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BrowserAdapter } from 'common/browser-adapters/browser-adapter';
import { Messages } from 'common/messages';
import { TargetPageInspector } from 'Devtools/target-page-inspector';
import { BaseStore } from '../common/base-store';
import { ConnectionNames } from '../common/constants/connection-names';
import { DevToolsOpenMessage, DevToolsStatusResponse } from '../common/types/dev-tools-messages';
import { DevToolStoreData } from '../common/types/store-data/dev-tool-store-data';

export class InspectHandler {
    constructor(
        private readonly devToolsStore: BaseStore<DevToolStoreData>,
        private readonly browserAdapter: BrowserAdapter,
        private readonly targetPageInspector: TargetPageInspector,
    ) {}

    public initialize(): void {
        this.devToolsStore.addChangedListener(() => {
            const state = this.devToolsStore.getState();

            if (
                state &&
                state.inspectElement &&
                (state.inspectElement.length === 1 || state.frameUrl)
            ) {
                const selector = state.inspectElement[state.inspectElement.length - 1];
                this.targetPageInspector.inspectElement(selector, state.frameUrl ?? undefined);
            }
        });

        const backgroundPageConnection = this.browserAdapter.connect({
            name: ConnectionNames.devTools,
        });

        backgroundPageConnection.postMessage({
            tabId: this.browserAdapter.getInspectedWindowTabId(),
        } as DevToolsOpenMessage);
    }
}
