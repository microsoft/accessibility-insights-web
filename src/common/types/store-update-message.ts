// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { StoreType } from './store-type';

export interface StoreUpdateMessage<TPayloadType> {
    isStoreUpdateMessage: boolean;
    messageType: string;
    storeType: StoreType;
    storeId: string;
    payload: TPayloadType;
    tabId?: number;
}
