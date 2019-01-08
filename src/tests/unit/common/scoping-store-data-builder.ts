// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ScopingStore } from '../../../background/stores/global/scoping-store';
import { IScopingStoreData } from '../../../common/types/store-data/scoping-store-data';
import { BaseDataBuilder } from './base-data-builder';

export class ScopingStoreDataBuilder extends BaseDataBuilder<IScopingStoreData> {
    constructor() {
        super();
        this.data = new ScopingStore(null).getDefaultState();
    }
}
