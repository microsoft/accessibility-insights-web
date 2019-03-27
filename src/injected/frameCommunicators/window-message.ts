// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ErrorMessageContent } from './error-message-content';

export interface WindowMessage {
    messageId: string;
    command: string;
    message?: any;
    error?: ErrorMessageContent;
    messageStableSignature: string;
    messageSourceId: string;
    messageVersion: string;
}
