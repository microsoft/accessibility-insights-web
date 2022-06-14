// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BrowserMessageResponse } from 'common/browser-adapters/browser-message-handler';

export interface Message {
    messageType: string;
    payload?: any;
}

export type InterpreterMessage = Message & { tabId?: number };

export type InterpreterResponse = BrowserMessageResponse;

export interface PayloadCallback<Payload> {
    (payload: Payload, tabId?: number): void | Promise<void>;
}
