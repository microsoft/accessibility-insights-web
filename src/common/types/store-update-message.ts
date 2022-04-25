// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { StoreType } from './store-type';

export const storeUpdateMessageType = 'STORE_CHANGED';

export interface StoreUpdateMessage<TPayloadType> {
    messageType: typeof storeUpdateMessageType;
    storeType: StoreType;
    storeId: string;
    payload: TPayloadType;
    tabId?: number;
}
