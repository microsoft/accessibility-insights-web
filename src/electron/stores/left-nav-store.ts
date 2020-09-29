// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { BaseStoreImpl } from 'background/stores/base-store-impl';
import { StoreNames } from 'common/stores/store-names';
import { LeftNavStoreData } from 'electron/data/left-nav-store-data';
import { LeftNavItemKey } from 'electron/types/left-nav-item-key';

export class LeftNavStore extends BaseStoreImpl<LeftNavStoreData<KeyT>> {
    constructor(private readonly defaultKey: LeftNavItemKey) {
        super(StoreNames.LeftNavStore);
    }

    public getDefaultState(): LeftNavStoreData {
        return {
            selectedKey: this.defaultKey,
        };
    }

    protected addActionListeners(): void {}
}
