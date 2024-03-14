// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { UnhandledBrowserMessageResponse } from 'common/browser-adapters/browser-message-handler';
export interface Message {
    messageType: string;
    payload?: any;
}

export type InterpreterMessage = Message & { tabId?: number | null };

// InterpreterResponse is intentionally the same shape as BrowserMessageResponse; the only
// difference is that intepreters don't accept response values, so result can only be a
// Promise<void> and not a Promise<any>
export type InterpreterResponse = UnhandledBrowserMessageResponse | HandledInterpreterResponse;
export type HandledInterpreterResponse = {
    messageHandled: true;

    // This is intentionally non-optional; don't use void unless you really mean it!
    //
    // void indicates a legacy "fire-and-forget" response which might include some async work not
    // tracked by a Promise. To indicate that the all work to handle this response completed
    // synchronously, use Promise.resolve().
    result: Promise<void> | void;
};

export interface PayloadCallback<Payload> {
    (payload: Payload, tabId?: number | null): void | Promise<void>;
}
