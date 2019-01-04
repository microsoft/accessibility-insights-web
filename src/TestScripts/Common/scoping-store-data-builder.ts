// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BaseDataBuilder } from './base-data-builder';
import { IScopingStoreData } from '../../common/types/store-data/scoping-store-data';
import { ScopingStore } from '../../background/stores/global/scoping-store';

export class ScopingStoreDataBuilder extends BaseDataBuilder<IScopingStoreData> {
    constructor() {
        super();
        this.data = new ScopingStore(null).getDefaultState();
    }
}
