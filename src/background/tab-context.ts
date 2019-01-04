// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Interpreter } from './interpreter';
import { TabContextStoreHub } from './stores/tab-context-store-hub';

export type TabToContextMap = IDictionaryNumberTo<TabContext>;

export class TabContext {
    public readonly interpreter: Interpreter;

    public readonly stores: TabContextStoreHub;

    public devToolsConnection?: chrome.runtime.Port;

    constructor(interpreter: Interpreter, storeHub: TabContextStoreHub) {
        this.interpreter = interpreter;
        this.stores = storeHub;
    }
}
