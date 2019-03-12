// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
interface Message {
    type: string;
    tabId?: number;
    payload?: any;
}

// tslint:disable-next-line:interface-name
interface IPayloadCallback {
    (payload: any, tabId): void;
}

// tslint:disable-next-line:interface-name
interface IRegisterTypeToPayloadCallback {
    (messageType: string, callback: IPayloadCallback): void;
}
