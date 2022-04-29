// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DictionaryNumberTo } from '../types/common-types';
import { Interpreter } from './interpreter';
import { TabContextStoreHub } from './stores/tab-context-store-hub';

export type TabToContextMap = DictionaryNumberTo<TabContext>;

export class TabContext {
    public readonly interpreter: Interpreter;

    public readonly stores: TabContextStoreHub;

    public devToolsConnection?: chrome.runtime.Port;

    public teardown = async () => {
        const promises = this.stores.getAllStores().map(store => store.teardown());
        await Promise.all(promises);
    };

    constructor(interpreter: Interpreter, storeHub: TabContextStoreHub) {
        this.interpreter = interpreter;
        this.stores = storeHub;
    }
}
