// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BaseStoreImpl } from 'background/stores/base-store-impl';
import { Action, ActionListener } from 'common/flux/action';
import { HandlerReturnType } from 'common/flux/event-handler-list';
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';

import { BaseStore } from '../../../common/base-store';
import { DefaultConstructor } from '../../../common/types/idefault-constructor';

export class StoreTester<TStoreData, TActions> {
    private actionName: string;
    private actionParam: any;
    private listener: ActionListener<unknown, void | Promise<void>>;
    private actions: DefaultConstructor<TActions>;
    private storeFactory: (actions) => BaseStoreImpl<TStoreData>;
    private postListenerMock: IMock<any>;

    constructor(
        actions: DefaultConstructor<TActions>,
        actionName: keyof TActions,
        storeFactory: (actions) => BaseStoreImpl<TStoreData, HandlerReturnType>,
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

    public async testListenerToNeverBeCalled(
        initial: TStoreData,
        expected: TStoreData,
    ): Promise<void> {
        await this.testListenerToBeCalled(initial, expected, Times.never());
    }

    public async testListenerToBeCalledOnce(
        initial: TStoreData,
        expected: TStoreData,
    ): Promise<void> {
        await this.testListenerToBeCalled(initial, expected, Times.once());
    }

    public async testListenerToBeCalled(
        initial: TStoreData,
        expected: TStoreData,
        times: Times,
    ): Promise<void> {
        const actionsMock = this.createActionsMock();

        const testObject = this.storeFactory(actionsMock.object);

        testObject.initialize(initial);

        const listenerMock = this.createChangeListener(testObject, times);

        testObject.addChangedListener(listenerMock.object);

        await this.listener(this.actionParam);

        expect(testObject.getState()).toEqual(expected);

        listenerMock.verifyAll();

        this.verifyPostListenerMock();
    }

    private verifyPostListenerMock(): void {
        if (this.postListenerMock) {
            this.postListenerMock.verifyAll();
        }
    }

    private createActionsMock(): IMock<TActions> {
        const actionMock = this.createActionMock();

        const actionsMock = Mock.ofType(this.actions, MockBehavior.Loose);
        actionsMock.setup(a => a[this.actionName]).returns(() => actionMock.object);

        return actionsMock;
    }

    private createActionMock(): IMock<Action<unknown, unknown>> {
        const actionMock = Mock.ofType<Action<unknown, void | Promise<void>>>();

        actionMock
            .setup(a => a.addListener(It.is(param => param instanceof Function)))
            .callback(listener => (this.listener = listener));

        return actionMock;
    }

    private createChangeListener(
        store: BaseStore<TStoreData>,
        times: Times,
    ): IMock<(store, args) => void> {
        const listenerMock = Mock.ofInstance((theStore, args) => {});

        listenerMock
            .setup(l => l(this.isSameStoreTypeMatcher(store), It.isAny()))
            .verifiable(times);

        return listenerMock;
    }

    private isSameStoreTypeMatcher(expectedStore: BaseStore<TStoreData>): BaseStore<TStoreData> {
        return It.is(actualStore => expectedStore.getId() === actualStore.getId());
    }
}

export type CtorWithArgs<T> = {
    new (...ctorArgs: any[]): T;
    prototype: Object;
};

export function createStoreWithNullParams<TStore>(ctor: CtorWithArgs<TStore>): TStore {
    return new ctor();
}
