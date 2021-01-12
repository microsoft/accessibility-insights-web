// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { IndexedDBDataKeys } from 'background/IndexedDBDataKeys';
import { BaseStoreImpl } from 'background/stores/base-store-impl';
import { IMock, It, Times } from 'typemoq';
import { IndexedDBAPI } from '../../../common/indexedDB/indexedDB';
import { DefaultConstructor } from '../../../common/types/idefault-constructor';
import { StoreTester } from './store-tester';

export class AssessmentStoreTester<TStoreData, TActions> extends StoreTester<TStoreData, TActions> {
    private indexDbMock: IMock<IndexedDBAPI>;
    constructor(
        actions: DefaultConstructor<TActions>,
        actionName: keyof TActions,
        storeFactory: (actions) => BaseStoreImpl<TStoreData>,
        indexDbMock: any,
    ) {
        super(actions, actionName, storeFactory);
        this.indexDbMock = indexDbMock;
    }

    public testListenerToBeCalledOnce(initial: TStoreData, expected: TStoreData): void {
        this.indexDbMock
            .setup(idm => idm.setItem(IndexedDBDataKeys.assessmentStore, It.isValue(expected)))
            .verifiable(Times.once());
        super.testListenerToBeCalledOnce(initial, expected);
    }
}
