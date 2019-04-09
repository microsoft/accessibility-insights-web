// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Message } from '../message';
import { BaseActionMessageCreator } from './base-action-message-creator';
import { StoreActionMessageCreator } from './store-action-message-creator';

export class StoreActionMessageCreatorImpl extends BaseActionMessageCreator implements StoreActionMessageCreator {
    private getStateMessages: string[];

    constructor(messages: string[], postMessage: (message: Message) => void, tabId: number) {
        super(postMessage, tabId);
        this.getStateMessages = messages;
    }

    public getAllStates(): void {
        this.getStateMessages.forEach(message => this.dispatchType(message));
    }
}
