// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { StoreUpdateMessageHub } from 'common/store-update-message-hub';
import { isEqual } from 'lodash';
import { BaseStore } from './base-store';
import { Store } from './flux/store';
import { StoreUpdateMessage } from './types/store-update-message';

export class StoreProxy<TState>
    extends Store<Promise<void>>
    implements BaseStore<TState, Promise<void>>
{
    private state: TState;

    constructor(
        private readonly storeId: string,
        private readonly messageHub: StoreUpdateMessageHub,
    ) {
        super();
        this.messageHub.registerStoreUpdateListener(storeId, this.onChange);
    }

    private onChange = async (message: StoreUpdateMessage<TState>): Promise<void> => {
        if (!isEqual(this.state, message.payload)) {
            this.state = message.payload;
            await this.emitChanged();
        }
    };

    public getState = (): TState => {
        return this.state;
    };

    public getId(): string {
        return this.storeId;
    }
}
