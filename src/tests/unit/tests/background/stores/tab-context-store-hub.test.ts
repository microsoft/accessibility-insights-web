// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ActionHub } from 'background/actions/action-hub';
import { PersistedData } from 'background/get-persisted-data';
import { TabContextStoreHub } from 'background/stores/tab-context-store-hub';
import { StoreType } from '../../../../../common/types/store-type';

describe('TabContextStoreHubTest', () => {
    let testSubject: TabContextStoreHub;
    beforeAll(() => {
        testSubject = new TabContextStoreHub(
            new ActionHub(),
            null,
            {} as PersistedData,
            null,
            null,
            null,
            true,
            null,
        );
    });

    it('verify getAllStores', () => {
        expect(testSubject.getAllStores().length).toBe(11);
    });

    it('verify store type', () => {
        expect(testSubject.getStoreType()).toEqual(StoreType.TabContextStore);
    });
});
