// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DevToolActionMessageCreator } from 'common/message-creators/dev-tool-action-message-creator';
import { BaseStore } from '../common/base-store';
import { DevToolStoreData } from '../common/types/store-data/dev-tool-store-data';
import { FrameUrlFinder } from './frame-url-finder';

export class FrameUrlController {
    constructor(
        private readonly devToolStore: BaseStore<DevToolStoreData>,
        private readonly devToolActionMessageCreator: DevToolActionMessageCreator,
        private readonly frameUrlFinder: FrameUrlFinder,
    ) {}

    public listenToStore(): void {
        this.devToolStore.addChangedListener(this.handleDevToolStateChange);
    }

    private handleDevToolStateChange = async (): Promise<void> => {
        const storeState = this.devToolStore.getState();

        if (
            storeState.inspectElement != null &&
            storeState.inspectElement.length > 1 &&
            storeState.frameUrl == null
        ) {
            const frameUrl = await this.frameUrlFinder.getTargetFrameUrl(storeState.inspectElement);
            this.devToolActionMessageCreator.setInspectFrameUrl(frameUrl);
        }
    };
}
