// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import type { Runtime } from 'webextension-polyfill';

// We wrap all of our individual responses/handlers in this type solely so that typescript can help
// us avoid a gotcha involving the use of async handler functions (see #5602).
export type BrowserMessageResponse =
    | HandledBrowserMessageResponse
    | UnhandledBrowserMessageResponse;

export type HandledBrowserMessageResponse = {
    messageHandled: true;

    // This is intentionally non-optional; don't use void unless you really mean it!
    //
    // void indicates a legacy "fire-and-forget" response which might include some async work not
    // tracked by a Promise. To indicate that the all work to handle this response completed
    // synchronously, use Promise.resolve().
    result: Promise<any> | void;
};
export type UnhandledBrowserMessageResponse = {
    messageHandled: false;

    // It would be more accurate to omit this, but including it makes it much more ergonomic for
    // tests/etc await response.result or expect(response.result)
    result?: undefined;
};

export type BrowserMessageHandler = (
    message: any,
    sender: Runtime.MessageSender,
) => BrowserMessageResponse;

export type RawBrowserMessageHandler = (
    message: any,
    sender: Runtime.MessageSender,
) => void | Promise<void>;

export function makeRawBrowserMessageHandler(
    handler: BrowserMessageHandler,
): RawBrowserMessageHandler {
    // The raw handler *MUST NOT* be async. This is because we need to distinguish void responses,
    // which the browser treats as "message not handled", from Promise<void> responses, which the
    // browser treats as "message handled, no response".
    return (message, sender) => {
        const response = handler(message, sender);
        return response.messageHandled ? response.result : undefined;
    };
}
