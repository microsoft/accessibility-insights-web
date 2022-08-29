// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    BrowserMessageResponse,
    HandledBrowserMessageResponse,
} from 'common/browser-adapters/browser-message-handler';
import { mergePromiseResponses } from 'common/merge-promise-responses';
import { isPromise } from 'common/promises/is-promise';
import { PromiseFactory } from 'common/promises/promise-factory';
import { filter } from 'lodash';

// As of writing, Chromium maintains its own 5 minute event timeout and will tear down our
// service worker if this is exceeded, even if other work is outstanding. To avoid this, our
// own timeout MUST be shorter than Chromium's.
const EVENT_TIMEOUT_MS = 60 * 1000; // 1 minute

// This class is responsible for merging event handler responses that might be any
// combination of "async" and "sync" handlers, aggregating response promises
// such that every underlying handler of both types is given adequate time to respond.
//
// See also BrowserEventManager
export class EventResponseFactory {
    public constructor(
        private readonly promiseFactory: PromiseFactory,
        private readonly mergeAsyncResponses: (
            promises: Promise<unknown>[],
        ) => Promise<void> = mergePromiseResponses,
    ) {}

    public async applyEventTimeout<T>(
        original: Promise<T>,
        timeoutErrorContext: string,
    ): Promise<T> {
        return await this.promiseFactory.timeout(original, EVENT_TIMEOUT_MS, timeoutErrorContext);
    }

    public mergeBrowserMessageResponses(
        responses: BrowserMessageResponse[],
    ): BrowserMessageResponse {
        const handledResponses = responses.filter(
            (r): r is HandledBrowserMessageResponse => r.messageHandled,
        );
        if (handledResponses.length === 0) {
            return { messageHandled: false };
        }

        return {
            messageHandled: true,
            result: this.mergeRawBrowserMessageResponses(handledResponses.map(r => r.result)),
        };
    }

    public mergeRawBrowserMessageResponses(
        responses: (void | Promise<void>)[],
    ): void | Promise<void> {
        const asyncResponses = filter(responses, isPromise);

        if (asyncResponses.length === 0) {
            return; // indicating a sync response
        }

        if (asyncResponses.length === 1) {
            return asyncResponses[0] as Promise<void>;
        }

        return this.mergeAsyncResponses(asyncResponses);
    }
}
