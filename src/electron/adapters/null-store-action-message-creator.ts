// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { StoreActionMessageCreator } from 'common/message-creators/store-action-message-creator';

export class NullStoreActionMessageCreator implements StoreActionMessageCreator {
    public getAllStates(): void {}
}
