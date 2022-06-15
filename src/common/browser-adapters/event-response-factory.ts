// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    BrowserMessageResponse,
    HandledBrowserMessageResponse,
} from 'common/browser-adapters/browser-message-handler';
import { isPromise } from 'common/promises/is-promise';
import { PromiseFactory } from 'common/promises/promise-factory';
import { partition } from 'lodash';

// As of writing, Chromium maintains its own 5 minute event timeout and will tear down our
// service worker if this is exceeded, even if other work is outstanding. To avoid this, our
// own timeout MUST be shorter than Chromium's.
const EVENT_TIMEOUT_MS = 60 * 1000; // 1 minute

// Ideally, all of our ApplicationListeners would return a Promise whose lifetime encapsulates
// whether the listener's work is done yet. As of writing, some listeners are "fire and forget",
// and continue to do some async work after returning undefined. To ensure those listeners have
// time to do their work, the event manager adds this (arbitrary) delay into its response to the
// browser event.
const FIRE_AND_FORGET_EVENT_DELAY_MS = 30 * 1000; // 30 seconds

// This class is responsible for merging event handler responses that might be any
// combination of "async" and "fire-and-forget" handlers, aggregating response promises
// such that every underlying handler of both types is given adequate time to respond.
//
// See also BrowserEventManager
export class EventResponseFactory {
    public constructor(
        private readonly promiseFactory: PromiseFactory,
        private readonly isServiceWorker: boolean,
    ) {}

    public async applyEventTimeout<T>(
        original: Promise<T>,
        timeoutErrorContext: string,
    ): Promise<T> {
        return await this.promiseFactory.timeout(original, EVENT_TIMEOUT_MS, timeoutErrorContext);
    }

    public async applyFireAndForgetDelay<T>(result: T): Promise<T> {
        // The fire and forget delay is not necessary in the manifest v2 background page, so we
        // avoid using it there because it carries a high risk of accidentally breaking it while
        // we're still working on manifest v3 changes to eliminate fire and forget events entirely
        if (this.isServiceWorker) {
            return await this.promiseFactory.delay(result, FIRE_AND_FORGET_EVENT_DELAY_MS);
        } else {
            return result;
        }
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
        const [asyncResponses, fireAndForgetResponses] = partition(responses, isPromise);

        if (asyncResponses.length === 0) {
            return; // indicating a fire and forget response
        }

        if (fireAndForgetResponses.length > 0) {
            asyncResponses.push(this.applyFireAndForgetDelay(null));
        }

        if (asyncResponses.length === 1) {
            return asyncResponses[0] as Promise<void>;
        }

        return this.mergeAsyncResponses(asyncResponses);
    }

    // We want behavior in between Promise.all and Promise.allSettled; we want to wait for every
    // promise even if one errors immediately, like allSettled, but we also want to reject the
    // wrapping promise if any of the inner ones fail (for error reporting purposes).
    private async mergeAsyncResponses(asyncResponses: Promise<unknown>[]): Promise<void> {
        const results = await Promise.allSettled(asyncResponses);

        const rejectedResults = results.filter(
            (r): r is PromiseRejectedResult => r.status === 'rejected',
        );

        if (rejectedResults.length === 1) {
            throw rejectedResults[0].reason;
        }

        if (rejectedResults.length > 0) {
            const rejectedReasons = rejectedResults.map(r => r.reason);
            throw new AggregateError(rejectedReasons);
        }
    }
}
