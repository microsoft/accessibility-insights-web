// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { autobind } from '@uifabric/utilities';

import { IBaseStore } from '../common/istore';
import { DevToolState } from '../common/types/store-data/idev-tool-state';
import { FrameUrlFinder } from './frame-url-finder';

export class FrameUrlSearchInitiator {
    private devToolStore: IBaseStore<DevToolState>;
    private frameUrlFinder: FrameUrlFinder;

    constructor(devToolStore: IBaseStore<DevToolState>, frameUrlFinder: FrameUrlFinder) {
        this.devToolStore = devToolStore;
        this.frameUrlFinder = frameUrlFinder;
    }

    public listenToStore(): void {
        this.devToolStore.addChangedListener(this.handleDevToolStateChange);
    }

    @autobind
    private handleDevToolStateChange(): void {
        const storeState = this.devToolStore.getState();

        if (storeState.inspectElement != null && storeState.inspectElement.length > 1 && storeState.frameUrl == null) {
            this.frameUrlFinder.processRequest({ target: storeState.inspectElement });
        }
    }
}
