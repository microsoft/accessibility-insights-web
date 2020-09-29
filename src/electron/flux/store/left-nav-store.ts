// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { BaseStoreImpl } from 'background/stores/base-store-impl';
import { StoreNames } from 'common/stores/store-names';
import { LeftNavStoreData } from 'electron/flux/types/left-nav-store-data';
import { LeftNavActions } from 'electron/flux/action/left-nav-actions';
import { LeftNavItem } from 'electron/types/left-nav-item';
import { LeftNavItemKey } from 'electron/types/left-nav-item-key';

export class LeftNavStore extends BaseStoreImpl<LeftNavStoreData> {
    constructor(private readonly actions: LeftNavActions) {
        super(StoreNames.LeftNavStore);
    }

    public getDefaultState(): LeftNavStoreData {
        return {
            selectedKey: 'overview',
        };
    }

    protected addActionListeners(): void {
        this.actions.itemSelected.addListener(this.onItemSelected);
    }

    private onItemSelected = (key: LeftNavItemKey): void => {
        this.state.selectedKey = key;
        this.emitChanged();
    };
}
