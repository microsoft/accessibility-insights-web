// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
interface IMessage {
    type: string;
    tabId?: number;
    payload?: any;
}

interface IPayloadCallback {
    (payload: any, tabId): void;
}

interface IRegisterTypeToPayloadCallback {
    (messageType: string, callback: IPayloadCallback): void;
}
