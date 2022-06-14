// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BrowserAdapter } from 'common/browser-adapters/browser-adapter';

// Returning a Promise indicates that this handler "handled" the message.
//
// BrowserMessageHandlers SHOULD NOT be async functions, since an async function would always
// indicate that the message is "handled".
export type BrowserMessageHandler = (message: any) => void | Promise<any>;

export class BrowserMessageDistributor {
    constructor(
        private readonly browserAdapter: BrowserAdapter,
        private readonly messageHandlers: BrowserMessageHandler[],
    ) {}

    public initialize(): void {
        this.browserAdapter.addListenerOnMessage(this.distributeMessage);
    }

    private distributeMessage = (message: any): void | Promise<any> => {
        for (const handler of this.messageHandlers) {
            const response = handler(message);
            if (response != null) {
                return response;
            }
        }
    };
}
