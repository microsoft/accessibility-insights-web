// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';

import { BaseStore } from '../../../background/stores/base-store';
import { Action } from '../../../common/flux/action';
import { IBaseStore } from '../../../common/istore';
import { IDefaultConstructor } from '../../../common/types/idefault-constructor';
import * as assert from './assertions';


export class StoreTester<TStoreData, TActions> {
    private actionName: string;
    private actionParam: any;
    private listener: Function;
    private actions: IDefaultConstructor<TActions>;
    private storeFactory: (actions) => BaseStore<TStoreData>;
    private postListenerMock: IMock<any>;

    constructor(
        actions: IDefaultConstructor<TActions>,
        actionName: keyof TActions,
        storeFactory: (actions) => BaseStore<TStoreData>,
    ) {
        this.actionName = actionName as string;
        this.storeFactory = storeFactory;
        this.actions = actions;
    }

    public withActionParam(param: any): StoreTester<TStoreData, TActions> {
        this.actionParam = param;
        return this;
    }

    public withPostListenerMock(mock: IMock<any>): StoreTester<TStoreData, TActions> {
        this.postListenerMock = mock;
        return this;
    }

    public testListenerToNeverBeCalled(initial: TStoreData, expected: TStoreData): void {
        this.testListenerToBeCalled(initial, expected, Times.never());
    }

    public testListenerToBeCalledOnce(initial: TStoreData, expected: TStoreData): void {
        this.testListenerToBeCalled(initial, expected, Times.once());
    }

    public testListenerToBeCalled(initial: TStoreData, expected: TStoreData, times: Times) {
        const actionsMock = this.createActionsMock();

        const testObject = this.storeFactory(actionsMock.object);

        testObject.initialize(initial);

        const listenerMock = this.createChangeListener(testObject, times);

        testObject.addChangedListener(listenerMock.object);

        this.listener(this.actionParam);

        assert.areEqualObjects(expected, testObject.getState(), 'expected state');

        listenerMock.verifyAll();

        this.verifyPostListenerMock();
    }

    private verifyPostListenerMock(): void {
        if (this.postListenerMock) {
            this.postListenerMock.verifyAll();
        }
    }

    private createActionsMock() {
        const actionMock = this.createActionMock();

        const actionsMock = Mock.ofType(this.actions, MockBehavior.Loose);
        actionsMock
            .setup(a => a[this.actionName])
            .returns(() => actionMock.object);

        return actionsMock;
    }

    private createActionMock() {
        const actionMock = Mock.ofType(Action);

        actionMock
            .setup(a => a.addListener(It.is(param => param instanceof Function)))
            .callback(listener => this.listener = listener);

        return actionMock;
    }

    private createChangeListener(store: IBaseStore<TStoreData>, times: Times) {
        const listenerMock = Mock.ofInstance((store, args) => { });

        listenerMock
            .setup(l => l(this.isSameStoreTypeMatcher(store), It.isAny()))
            .verifiable(times);

        return listenerMock;
    }

    private isSameStoreTypeMatcher(expectedStore: IBaseStore<TStoreData>): IBaseStore<TStoreData> {
        return It.is(actualStore =>
            expectedStore.getId() === actualStore.getId());
    }
}

export type CtorWithArgs<T> = {
    new(...ctorArgs: any[]): T;
    prototype: Object;
};

export function createStoreWithNullParams<TStore>(ctor: CtorWithArgs<TStore>): TStore {
    return new ctor();
}
