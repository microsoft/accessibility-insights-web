// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

export type BackchannelRequestMessageType =
    | 'backchannel_window_message.store_request'
    | 'backchannel_window_message.retrieve_request';

export interface BackchannelRequestMessage {
    messageId: string;
    messageType: BackchannelRequestMessageType;
}

export interface BackchannelStoreRequestMessage extends BackchannelRequestMessage {
    messageId: string; // same as WindowMessage
    messageType: 'backchannel_window_message.store_request';
    stringifiedMessageData: string; // JSON.stringify(originalMessage)
}

export interface BackchannelRetrieveRequestMessage extends BackchannelRequestMessage {
    messageId: string; // same as WindowMessage
    messageType: 'backchannel_window_message.retrieve_request';
}

export interface BackchannelRetrieveResponseMessage {
    messageId: string; // same as WindowMessage
    messageType: 'backchannel_window_message.retrieve_response';
    stringifiedMessageData: string;
}
