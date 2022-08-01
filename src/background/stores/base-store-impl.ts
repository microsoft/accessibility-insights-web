// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BaseStore } from '../../common/base-store';
import { Store } from '../../common/flux/store';
import { StoreNames } from '../../common/stores/store-names';

export abstract class BaseStoreImpl<TState> extends Store implements BaseStore<TState> {
    private storeName: StoreNames;
    protected state: TState;

    constructor(storeName: StoreNames) {
        super();
        this.storeName = storeName;
        this.onGetCurrentState = this.onGetCurrentState.bind(this);
    }

    public abstract getDefaultState(): TState;
    protected abstract addActionListeners(): void;

    public initialize(initialState?: TState): void {
        this.state = initialState || this.getDefaultState();

        this.addActionListeners();
    }

    public getId(): string {
        return StoreNames[this.storeName];
    }

    public getState(): TState {
        return this.state;
    }

    protected async onGetCurrentState(): Promise<void> {
        this.emitChanged();
    }
}
