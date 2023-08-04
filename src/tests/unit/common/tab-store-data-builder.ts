// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { TabStore } from 'background/stores/tab-store';
import { TabStoreData } from '../../../common/types/store-data/tab-store-data';
import { BaseDataBuilder } from './base-data-builder';

export class TabStoreDataBuilder extends BaseDataBuilder<TabStoreData> {
    constructor() {
        super();
        this.data = new TabStore(null!, null!, null!, null!, null!, null!, null!).getDefaultState();
    }
}
