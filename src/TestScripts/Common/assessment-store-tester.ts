// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IMock, It, Times } from 'typemoq';

import { IndexedDBDataKeys } from '../../background/IndexedDBDataKeys';
import { BaseStore } from '../../background/stores/base-store';
import { IndexedDBAPI } from '../../common/indexedDB/indexedDB';
import { IDefaultConstructor } from '../../common/types/idefault-constructor';
import { StoreTester } from './store-tester';

export class AssessmentStoreTester<TStoreData, TActions> extends StoreTester<TStoreData, TActions> {
    private indexDbMock: IMock<IndexedDBAPI>;
    constructor(
        actions: IDefaultConstructor<TActions>,
        actionName: keyof TActions,
        storeFactory: (actions) => BaseStore<TStoreData>,
        indexDbMock: any,
    ) {
        super(actions, actionName, storeFactory);
        this.indexDbMock = indexDbMock;
    }

    public testListenerToBeCalledOnce(initial: TStoreData, expected: TStoreData, getItemReturnValue: TStoreData = null): void {
        this.indexDbMock
            .setup(idm => idm.setItem(IndexedDBDataKeys.assessmentStore, It.isValue(expected)))
            .verifiable(Times.once());
        super.testListenerToBeCalledOnce(initial, expected);
    }
}
