// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IBaseStore } from '../../common/istore';
import { StoreType } from '../../common/types/store-type';

export interface StoreHub {
    getAllStores(): IBaseStore<any>[];
    getStoreType(): StoreType;
}
