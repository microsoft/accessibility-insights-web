// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { GenericStoreMessageTypes } from 'common/constants/generic-store-messages-types';
import { StoreType } from './store-type';

export interface StoreUpdateMessage<TPayloadType> {
    messageType: GenericStoreMessageTypes.storeStateChanged;
    storeType: StoreType;
    storeId: string;
    payload: TPayloadType;
    tabId?: number;
}
