// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { autobind } from '@uifabric/utilities';

import { ITab } from './../common/itab.d';
import { BrowserAdapter } from './browser-adapter';
import { GlobalContext } from './global-context';
import { TabToContextMap } from './tab-context';
import { TabContextBroadcaster } from './tab-context-broadcaster';

export interface ISender {
    tab?: ITab;
}

export class MessageDistributor {
    private readonly _tabtoContextMap: TabToContextMap;
    private readonly _globalContext: GlobalContext;
    private readonly _broadcaster: TabContextBroadcaster;
    private _browserAdapter: BrowserAdapter;

    constructor(globalContext: GlobalContext, tabIdToContextMap: TabToContextMap, browserAdapter: BrowserAdapter) {
        this._globalContext = globalContext;
        this._tabtoContextMap = tabIdToContextMap;
        this._browserAdapter = browserAdapter;
    }

    public initialize() {
        this._browserAdapter.addListenerOnMessage(this.distributeMessage);
    }

    @autobind
    private distributeMessage(message: IMessage, sender?: ISender) {
        message.tabId = this.getTabId(message, sender);

        const isInterpretedUsingGlobalContext = this._globalContext.interpreter.interpret(message);
        const isInterpretedUsingTabContext = this.tryInterpretUsingTabContext(message);

        if (!isInterpretedUsingGlobalContext && !isInterpretedUsingTabContext) {
            console.log('Unable to interpret message - ', message);
        }
    }

    private getTabId(message: IMessage, sender?: ISender): number {
        if (message != null && message.tabId != null) {
            return message.tabId;
        } else if (sender != null && sender.tab != null && sender.tab.id != null) {
            return sender.tab.id;
        }

        return null;
    }

    private tryInterpretUsingTabContext(message: IMessage) {
        let hasInterpreted: boolean;
        const tabContext = this._tabtoContextMap[message.tabId];

        if (tabContext != null) {
            hasInterpreted = tabContext.interpreter.interpret(message);
        }
        return hasInterpreted;
    }
}
