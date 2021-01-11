// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DevToolStore } from 'background/stores/dev-tools-store';
import { IMock, It, Mock, Times } from 'typemoq';

import { BaseStore } from '../../../common/base-store';

export class StoreMock<TStoreState> {
    private store: IMock<BaseStore<TStoreState>> = Mock.ofType(DevToolStore as any);

    private listeners: Function[] = [];
    public setupGetId(id: string, times: number = 1): StoreMock<TStoreState> {
        this.store
            .setup(x => x.getId())
            .returns(() => id)
            .verifiable(Times.exactly(times));

        return this;
    }

    public setupGetState(state: TStoreState, times: number = 1): StoreMock<TStoreState> {
        this.store
            .setup(x => x.getState())
            .returns(() => state)
            .verifiable(Times.exactly(times));

        return this;
    }

    public setupAddChangedListener(times: number = 1): StoreMock<TStoreState> {
        this.store
            .setup(x => x.addChangedListener(It.isAny()))
            .returns(cb => this.listeners.push(cb))
            .verifiable(Times.exactly(times));

        return this;
    }

    public setupRemoveListener(times: number = 1): StoreMock<TStoreState> {
        this.store
            .setup(x => x.removeChangedListener(It.isAny()))
            .callback(cb => {
                this.listeners = this.listeners.filter(listener => listener !== cb);
            })
            .verifiable(Times.exactly(times));

        return this;
    }

    public invokeChangeListener(): StoreMock<TStoreState> {
        this.listeners.forEach(listener => {
            listener();
        });

        return this;
    }

    public getObject(): BaseStore<TStoreState> {
        return this.store.object;
    }

    public verifyAll(): void {
        this.store.verifyAll();
    }
}
