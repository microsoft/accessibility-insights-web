// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
export interface Message {
    messageType: string;
    payload?: any;
}

export type InterpreterMessage = Message & { tabId?: number };

export interface PayloadCallback {
    (payload: any, tabId): void;
}

export interface RegisterTypeToPayloadCallback {
    (messageType: string, callback: PayloadCallback): void;
}
