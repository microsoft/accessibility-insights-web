// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { TabContextManager } from 'background/tab-context-manager';
import { BrowserAdapter } from 'common/browser-adapters/browser-adapter';
import { Tab } from '../common/itab';
import { Logger } from '../common/logging/logger';
import { InterpreterMessage } from '../common/message';
import { GlobalContext } from './global-context';
import { PostMessageContentHandler } from './post-message-content-handler';

export interface Sender {
    tab?: Tab;
}

export class BackgroundMessageDistributor {
    constructor(
        private readonly globalContext: GlobalContext,
        private readonly tabContextManager: TabContextManager,
        private readonly postMessageContentHandler: PostMessageContentHandler,
        private readonly browserAdapter: BrowserAdapter,
        private readonly logger: Logger,
    ) {}

    public initialize(): void {
        this.browserAdapter.addListenerOnMessage(this.distributeMessage);
    }

    private distributeMessage = (message: InterpreterMessage, sender?: Sender): Promise<any> => {
        message.tabId = this.getTabId(message, sender);

        const isInterpretedUsingGlobalContext = this.globalContext.interpreter.interpret(message);
        const isInterpretedUsingTabContext = this.tryInterpretUsingTabContext(message);
        const { success: isInterpretedAsBackchannelWindowMessage, response } =
            this.postMessageContentHandler.handleMessage(message);

        if (
            !isInterpretedUsingGlobalContext &&
            !isInterpretedUsingTabContext &&
            !isInterpretedAsBackchannelWindowMessage
        ) {
            this.logger.log('Unable to interpret message - ', message);
        }

        if (response) {
            return response;
        } else {
            return Promise.resolve();
        }
    };

    private getTabId(message: InterpreterMessage, sender?: Sender): number | null {
        if (message != null && message.tabId != null) {
            return message.tabId;
        } else if (sender != null && sender.tab != null && sender.tab.id != null) {
            return sender.tab.id;
        }

        return null;
    }

    private tryInterpretUsingTabContext(message: InterpreterMessage): boolean {
        if (message.tabId != null) {
            return this.tabContextManager.interpretMessageForTab(message.tabId, message);
        }

        return false;
    }
}
