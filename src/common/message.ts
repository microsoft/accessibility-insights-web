// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
export interface Message {
    messageType: string;
    payload?: any;
}

export type InterpreterMessage = Message & { tabId?: number };

export interface PayloadCallback<Payload> {
    (payload: Payload, tabId?: number): void | Promise<void>;
}
