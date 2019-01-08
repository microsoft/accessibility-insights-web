// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IMock, It, Mock, Times } from 'typemoq';

import { DevToolStore } from '../../../background/stores/dev-tools-store';
import { IBaseStore } from '../../../common/istore';


export class StoreMock<TStoreState> {
    private _store: IMock<IBaseStore<TStoreState>> = Mock.ofType(DevToolStore as any);

    private _listeners: Function[] = [];
    public setupGetId(id: string, times: number = 1): StoreMock<TStoreState> {
        this._store
            .setup(x => x.getId())
            .returns(() => id)
            .verifiable(Times.exactly(times));

        return this;
    }

    public setupGetState(state: TStoreState, times: number = 1): StoreMock<TStoreState> {
        this._store
            .setup(x => x.getState())
            .returns(() => state)
            .verifiable(Times.exactly(times));

        return this;
    }

    public setupAddChangedListener(times: number = 1): StoreMock<TStoreState> {
        this._store
            .setup(x => x.addChangedListener(It.isAny()))
            .returns(cb => this._listeners.push(cb))
            .verifiable(Times.exactly(times));

        return this;
    }

    public setupRemoveListener(times: number = 1): StoreMock<TStoreState> {
        this._store
            .setup(x => x.removeChangedListener(It.isAny()))
            .callback(cb => {
                this._listeners = this._listeners.filter(listener => listener !== cb);
            })
            .verifiable(Times.exactly(times));

        return this;
    }

    public invokeChangeListener(): StoreMock<TStoreState> {
        this._listeners.forEach(listener => {
            listener();
        });

        return this;
    }

    public getObject() {
        return this._store.object;
    }

    public verifyAll(): void {
        this._store.verifyAll();
    }
}
