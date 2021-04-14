// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ScopingStore } from 'background/stores/global/scoping-store';
import { ScopingStoreData } from '../../../common/types/store-data/scoping-store-data';
import { BaseDataBuilder } from './base-data-builder';

export class ScopingStoreDataBuilder extends BaseDataBuilder<ScopingStoreData> {
    constructor() {
        super();
        this.data = new ScopingStore(null!).getDefaultState();
    }
}
