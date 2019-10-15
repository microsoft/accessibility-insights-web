// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ActionMessageDispatcher } from 'common/message-creators/types/dispatcher';

import { StoreActionMessageCreator } from './store-action-message-creator';

export class StoreActionMessageCreatorImpl implements StoreActionMessageCreator {
    constructor(private readonly getStateMessages: string[], private readonly dispatcher: ActionMessageDispatcher) {}

    public getAllStates(): void {
        this.getStateMessages.forEach(message => this.dispatcher.dispatchType(message));
    }
}
