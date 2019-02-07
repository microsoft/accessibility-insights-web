// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { autobind } from '@uifabric/utilities';

import { ITab } from './../common/itab.d';
import { BrowserAdapter } from './browser-adapter';
import { GlobalContext } from './global-context';
import { TabToContextMap } from './tab-context';
import { createConsoleLogger } from '../common/logging/console-logger';
import { Logger } from '../common/logging/logger';

export interface Sender {
    tab?: ITab;
}

export class MessageDistributor {
    constructor(
        private globalContext: GlobalContext,
        private tabToContextMap: TabToContextMap,
        private browserAdapter: BrowserAdapter,
        private logger: Logger = createConsoleLogger(),
    ) {}

    public initialize(): void {
        this.browserAdapter.addListenerOnMessage(this.distributeMessage);
    }

    @autobind
    private distributeMessage(message: IMessage, sender?: Sender) {
        message.tabId = this.getTabId(message, sender);

        const isInterpretedUsingGlobalContext = this.globalContext.interpreter.interpret(message);
        const isInterpretedUsingTabContext = this.tryInterpretUsingTabContext(message);

        if (!isInterpretedUsingGlobalContext && !isInterpretedUsingTabContext) {
            this.logger.log('Unable to interpret message - ', message);
        }
    }

    private getTabId(message: IMessage, sender?: Sender): number {
        if (message != null && message.tabId != null) {
            return message.tabId;
        } else if (sender != null && sender.tab != null && sender.tab.id != null) {
            return sender.tab.id;
        }

        return null;
    }

    private tryInterpretUsingTabContext(message: IMessage) {
        let hasInterpreted: boolean;
        const tabContext = this.tabToContextMap[message.tabId];

        if (tabContext != null) {
            hasInterpreted = tabContext.interpreter.interpret(message);
        }

        return hasInterpreted;
    }
}
