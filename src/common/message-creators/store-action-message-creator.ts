// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BaseActionMessageCreator } from './base-action-message-creator';
import { IStoreActionMessageCreator } from './istore-action-message-creator';

export class StoreActionMessageCreator extends BaseActionMessageCreator implements IStoreActionMessageCreator {
    private getStateMessages: string[];

    constructor(
        messages: string[],
        postMessage: (message: IMessage) => void,
        tabId: number,
    ) {
        super(postMessage, tabId);
        this.getStateMessages = messages;
    }

    public getAllStates(): void {
        this.getStateMessages.forEach(message => this.dispatchType(message));
    }
}
