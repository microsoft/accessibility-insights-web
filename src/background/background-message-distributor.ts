// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BrowserAdapter } from 'common/browser-adapters/browser-adapter';
import { BrowserMessageResponse } from 'common/browser-adapters/browser-message-handler';
import { EventResponseFactory } from 'common/browser-adapters/event-response-factory';
import { InterpreterMessage, InterpreterResponse } from 'common/message';
import { Tab } from 'common/types/store-data/itab';

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
        this.browserAdapter.addListenerOnRuntimeMessage(this.distributeMessage);
    }

    private distributeMessage = (message: any, sender?: Sender): BrowserMessageResponse => {
        if (sender?.tab?.id) {
            message = { tabId: sender.tab.id, ...message };
        }

        const interpreterResponse = this.eventResponseFactory.mergeBrowserMessageResponses([
            this.globalContext.interpreter.interpret(message),
            this.tryInterpretUsingTabContext(message),
        ]);

        if (interpreterResponse.messageHandled) {
            return interpreterResponse;
        }

        const postMessageResponse = this.postMessageContentHandler.handleBrowserMessage(message);

        if (postMessageResponse.messageHandled) {
            return postMessageResponse;
        }

        // Responding with a rejected promise tells the browser "we are the authoritative handler
        // of this type of message; it is invalid and you should immediately emit an error at the
        // sender". This is different from { messageHandled: false }, which would instead indicate
        // "we didn't know how to handle this message, but some other extension page might, so don't
        // indicate an error at the sender until a timeout elapses with no context responding".
        //
        // This is only correct because:
        //   * our extension only ever uses client <-> background messages
        //   * this distributor is only for use in the (sole) background context
        //
        // If we ever start sending messages directly between different client pages, this will need
        // to be updated to return { messageHandled: false } instead.
        return {
            messageHandled: true,
            result: Promise.reject(
                new Error(`Unable to interpret message - ${JSON.stringify(message)}`),
            ),
        };
    };

    private tryInterpretUsingTabContext(message: InterpreterMessage): InterpreterResponse {
        if (message.tabId != null) {
            return this.tabContextManager.interpretMessageForTab(message.tabId, message);
        }

        return { messageHandled: false };
    }
}
