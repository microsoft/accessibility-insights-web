// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
export interface Message {
    // tslint:disable-next-line:no-reserved-keywords
    type: string;
    tabId?: number;
    payload?: any;
}

export interface PayloadCallback {
    (payload: any, tabId): void;
}

export interface RegisterTypeToPayloadCallback {
    (messageType: string, callback: PayloadCallback): void;
}
