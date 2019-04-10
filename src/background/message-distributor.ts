// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { autobind } from '@uifabric/utilities';
import { createDefaultLogger } from '../common/logging/default-logger';
import { Logger } from '../common/logging/logger';
import { Message } from '../common/message';
import { Tab } from './../common/itab.d';
import { BrowserAdapter } from './browser-adapter';
import { GlobalContext } from './global-context';
import { TabToContextMap } from './tab-context';

export interface Sender {
    tab?: Tab;
}

export class MessageDistributor {
    constructor(
        private readonly globalContext: GlobalContext,
        private readonly tabToContextMap: TabToContextMap,
        private readonly browserAdapter: BrowserAdapter,
        private readonly logger: Logger = createDefaultLogger(),
    ) {}

    public initialize(): void {
        this.browserAdapter.addListenerOnMessage(this.distributeMessage);
    }

    @autobind
    private distributeMessage(message: Message, sender?: Sender): void {
        message.tabId = this.getTabId(message, sender);

        const isInterpretedUsingGlobalContext = this.globalContext.interpreter.interpret(message);
        const isInterpretedUsingTabContext = this.tryInterpretUsingTabContext(message);

        if (!isInterpretedUsingGlobalContext && !isInterpretedUsingTabContext) {
            this.logger.log('Unable to interpret message - ', message);
        }
    }

    private getTabId(message: Message, sender?: Sender): number {
        if (message != null && message.tabId != null) {
            return message.tabId;
        } else if (sender != null && sender.tab != null && sender.tab.id != null) {
            return sender.tab.id;
        }

        return null;
    }

    private tryInterpretUsingTabContext(message: Message): boolean {
        let hasInterpreted: boolean;
        const tabContext = this.tabToContextMap[message.tabId];

        if (tabContext != null) {
            hasInterpreted = tabContext.interpreter.interpret(message);
        }

        return hasInterpreted;
    }
}
