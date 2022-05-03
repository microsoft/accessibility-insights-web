// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { Interpreter } from 'background/interpreter';
import { TabContextStoreHub } from 'background/stores/tab-context-store-hub';
import { TabContext } from 'background/tab-context';
import { PersistentStore } from 'common/flux/persistent-store';
import { IMock, Mock, Times } from 'typemoq';

describe('TabContextTests', () => {
    let interpreterMock: IMock<Interpreter>;
    let storeHubMock: IMock<TabContextStoreHub>;
    let testSubject: TabContext;
    let storeMocks: IMock<PersistentStore<any>>[];

    beforeEach(() => {
        interpreterMock = Mock.ofType<Interpreter>();
        storeHubMock = Mock.ofType<TabContextStoreHub>();
        storeMocks = [Mock.ofType<PersistentStore<any>>(), Mock.ofType<PersistentStore<any>>()];
        testSubject = new TabContext(interpreterMock.object, storeHubMock.object);
    });

    it('teardown', async () => {
        storeHubMock
            .setup(storeHub => storeHub.getAllStores())
            .returns(() => storeMocks.map(storeMock => storeMock.object))
            .verifiable(Times.once());

        storeMocks.forEach(storeMock => setupStoreMock(storeMock));

        await testSubject.teardown();

        storeHubMock.verifyAll();
        storeMocks.forEach(storeMock => storeMock.verifyAll());
    });

    function setupStoreMock(storeMock: IMock<PersistentStore<any>>): void {
        storeMock
            .setup(store => store.teardown())
            .returns(() => Promise.resolve())
            .verifiable(Times.once());
    }
});
