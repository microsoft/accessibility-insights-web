// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BrowserAdapter } from '../common/browser-adapters/browser-adapter';
import { Tab } from '../common/itab';
import { Logger } from '../common/logging/logger';
import { InterpreterMessage } from '../common/message';
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
        private readonly logger: Logger,
    ) {}

    public initialize(): void {
        this.browserAdapter.addListenerOnMessage(this.distributeMessage);
    }

    private distributeMessage = (message: InterpreterMessage, sender?: Sender): void => {
        message.tabId = this.getTabId(message, sender);

        const isInterpretedUsingGlobalContext = this.globalContext.interpreter.interpret(message);
        const isInterpretedUsingTabContext = this.tryInterpretUsingTabContext(message);
        const isInterpretedAsBackchannelWindowMessage = message.messageType?.startsWith(
            'backchannel_window_message',
        );

        if (
            !isInterpretedUsingGlobalContext &&
            !isInterpretedUsingTabContext &&
            !isInterpretedAsBackchannelWindowMessage
        ) {
            this.logger.log('Unable to interpret message - ', message);
        }
    };

    private getTabId(message: InterpreterMessage, sender?: Sender): number {
        if (message != null && message.tabId != null) {
            return message.tabId;
        } else if (sender != null && sender.tab != null && sender.tab.id != null) {
            return sender.tab.id;
        }

        return null;
    }

    private tryInterpretUsingTabContext(message: InterpreterMessage): boolean {
        let hasInterpreted: boolean;
        const tabContext = this.tabToContextMap[message.tabId];

        if (tabContext != null) {
            hasInterpreted = tabContext.interpreter.interpret(message);
        }

        return hasInterpreted;
    }
}
