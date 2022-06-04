// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BrowserAdapter } from 'common/browser-adapters/browser-adapter';
import { EventResponseFactory } from 'common/browser-adapters/event-response-factory';
import { Tab } from 'common/itab';
import { InterpreterMessage, InterpreterResponse } from 'common/message';

import { GlobalContext } from './global-context';
import { PostMessageContentHandler } from './post-message-content-handler';
import { TabContextManager } from './tab-context-manager';

export interface Sender {
    tab?: Tab;
}

export class BackgroundMessageDistributor {
    constructor(
        private readonly globalContext: GlobalContext,
        private readonly tabContextManager: TabContextManager,
        private readonly postMessageContentHandler: PostMessageContentHandler,
        private readonly browserAdapter: BrowserAdapter,
        private readonly eventResponseFactory: EventResponseFactory,
    ) {}

    public initialize(): void {
        this.browserAdapter.addListenerOnMessage(this.distributeMessage);
    }

    private distributeMessage = (
        message: InterpreterMessage,
        sender?: Sender,
    ): void | Promise<any> => {
        if (sender?.tab?.id) {
            message = { tabId: sender.tab.id, ...message };
        }

        const interpreterResponse = this.eventResponseFactory.mergeInterpreterResponses([
            this.globalContext.interpreter.interpret(message),
            this.tryInterpretUsingTabContext(message),
        ]);

        if (interpreterResponse.messageHandled) {
            return interpreterResponse.result;
        }

        const postMessageResponse = this.postMessageContentHandler.handleMessage(message);

        if (postMessageResponse.messageHandled) {
            if (postMessageResponse.response) {
                return Promise.resolve(postMessageResponse.response);
            } else {
                return; // fire and forget
            }
        }

        return Promise.reject(
            new Error(`Unable to interpret message - ${JSON.stringify(message)}`),
        );
    };

    private tryInterpretUsingTabContext(message: InterpreterMessage): InterpreterResponse {
        if (message.tabId != null) {
            return this.tabContextManager.interpretMessageForTab(message.tabId, message);
        }

        return { messageHandled: false };
    }
}
