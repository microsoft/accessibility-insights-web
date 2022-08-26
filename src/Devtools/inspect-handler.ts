// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BrowserAdapter } from 'common/browser-adapters/browser-adapter';
import { InterpreterMessage } from 'common/message';
import { Messages } from 'common/messages';
import { TargetPageInspector } from 'Devtools/target-page-inspector';
import { BaseStore } from '../common/base-store';
import { DevToolStoreData } from '../common/types/store-data/dev-tool-store-data';

export class InspectHandler {
    constructor(
        private readonly devToolsStore: BaseStore<DevToolStoreData, Promise<void>>,
        private readonly browserAdapter: BrowserAdapter,
        private readonly targetPageInspector: TargetPageInspector,
    ) {}

    public async initialize(): Promise<void> {
        this.devToolsStore.addChangedListener(async () => {
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

        await this.sendDevtoolOpened();
    }

    private async sendDevtoolOpened(): Promise<void> {
        const message: InterpreterMessage = {
            messageType: Messages.DevTools.Opened,
            tabId: this.browserAdapter.getInspectedWindowTabId()!,
        };

        await this.browserAdapter.sendMessageToFrames(message);
    }
}
