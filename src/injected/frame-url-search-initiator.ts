// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BaseStore } from '../common/base-store';
import { DevToolState } from '../common/types/store-data/idev-tool-state';
import { FrameUrlFinder } from './frame-url-finder';

export class FrameUrlSearchInitiator {
    private devToolStore: BaseStore<DevToolState>;
    private frameUrlFinder: FrameUrlFinder;

    constructor(
        devToolStore: BaseStore<DevToolState>,
        frameUrlFinder: FrameUrlFinder,
    ) {
        this.devToolStore = devToolStore;
        this.frameUrlFinder = frameUrlFinder;
    }

    public listenToStore(): void {
        this.devToolStore.addChangedListener(this.handleDevToolStateChange);
    }

    private handleDevToolStateChange = (): void => {
        const storeState = this.devToolStore.getState();

        if (
            storeState.inspectElement != null &&
            storeState.inspectElement.length > 1 &&
            storeState.frameUrl == null
        ) {
            this.frameUrlFinder.processRequest({
                target: storeState.inspectElement,
            });
        }
    };
}
