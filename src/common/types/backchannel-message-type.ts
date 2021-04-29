// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

export type BackchannelStoreRequestMessage = {
    messageId: string; // same as WindowMessage
    messageType: 'backchannel_window_message.store_request';
    stringifiedMessageData: string; // JSON.stringify(originalMessage)
};

export type BackchannelRetrieveRequestMessage = {
    messageId: string; // same as WindowMessage
    messageType: 'backchannel_window_message.retrieve_request';
};

export type BackchannelRetrieveResponseMessage = {
    messageId: string; // same as WindowMessage
    messageType: 'backchannel_window_message.retrieve_response';
    stringifiedMessageData: string;
};
