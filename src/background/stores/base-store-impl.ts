// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { identity } from 'lodash';
import { BaseStore } from '../../common/base-store';
import { Store } from '../../common/flux/store';
import { StoreNames } from '../../common/stores/store-names';

export type StateProcessor<State> = (state: State) => State;

export abstract class BaseStoreImpl<TState> extends Store implements BaseStore<TState> {
    protected state: TState;

    constructor(
        private readonly storeName: StoreNames,
        private readonly getStateProcessor: StateProcessor<TState> = identity,
    ) {
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
        return this.getStateProcessor(this.state);
    }

    protected onGetCurrentState(): void {
        this.emitChanged();
    }
}
