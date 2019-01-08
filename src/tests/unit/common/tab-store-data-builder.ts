// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { TabStore } from '../../../background/stores/tab-store';
import { ITabStoreData } from '../../../common/types/store-data/itab-store-data';
import { BaseDataBuilder } from './base-data-builder';

export class TabStoreDataBuilder extends BaseDataBuilder<ITabStoreData> {
    constructor() {
        super();
        this.data = new TabStore(null, null).getDefaultState();
    }
}
