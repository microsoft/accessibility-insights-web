// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { BaseStoreImpl } from 'background/stores/base-store-impl';
import { StoreNames } from 'common/stores/store-names';
import { LeftNavStoreData } from 'electron/data/left-nav-store-data';

export class LeftNavStore<KeyT> extends BaseStoreImpl<LeftNavStoreData<KeyT>> {
    constructor(private readonly defaultKey: KeyT) {
        super(StoreNames.LeftNavStore);
    }

    public getDefaultState(): LeftNavStoreData<KeyT> {
        return {
            selectedKey: this.defaultKey,
        };
    }

    protected addActionListeners(): void {}
}
