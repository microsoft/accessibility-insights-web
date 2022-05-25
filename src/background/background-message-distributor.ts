// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { TabContextManager } from 'background/tab-context-manager';
import { BrowserAdapter } from 'common/browser-adapters/browser-adapter';
import { Tab } from '../common/itab';
import { Logger } from '../common/logging/logger';
import { InterpreterMessage, InterpreterResponse } from '../common/message';
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

    private distributeMessage = (
        message: InterpreterMessage,
        sender?: Sender,
    ): void | Promise<any> => {
        message.tabId = this.getTabId(message, sender);

        const { messageHandled: isInterpretedUsingGlobalContext, result: globalContextResult } =
            this.globalContext.interpreter.interpret(message);

        const { messageHandled: isInterpretedUsingTabContext, result: tabContextResult } =
            this.tryInterpretUsingTabContext(message);

        const {
            messageHandled: isInterpretedAsBackchannelWindowMessage,
            response: backchannelMessageResponse,
        } = this.postMessageContentHandler.handleMessage(message);

        if (
            !isInterpretedUsingGlobalContext &&
            !isInterpretedUsingTabContext &&
            !isInterpretedAsBackchannelWindowMessage
        ) {
            this.logger.log('Unable to interpret message - ', message);
        }

        if (globalContextResult || tabContextResult || backchannelMessageResponse) {
            return this.createResponsePromise(
                [globalContextResult, tabContextResult],
                backchannelMessageResponse,
            );
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

    private tryInterpretUsingTabContext(message: InterpreterMessage): InterpreterResponse {
        if (message.tabId != null) {
            return this.tabContextManager.interpretMessageForTab(message.tabId, message);
        }

        return { messageHandled: false };
    }

    private async createResponsePromise(
        promisesToAwait: (Promise<void> | void)[],
        response: any | Promise<any>,
    ): Promise<any> {
        await Promise.all(promisesToAwait);

        return response;
    }
}
