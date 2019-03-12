// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
interface Message {
    type: string;
    tabId?: number;
    payload?: any;
}

interface PayloadCallback {
    (payload: any, tabId): void;
}

interface RegisterTypeToPayloadCallback {
    (messageType: string, callback: PayloadCallback): void;
}
