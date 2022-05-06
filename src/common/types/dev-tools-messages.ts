// Copyright (c) Microsoft Corporation. All rights reserved.

import { Message } from 'common/message';

// Licensed under the MIT License.
export interface DevToolsOpenMessage {
    tabId: number;
}

export interface DevToolsStatusRequest extends Message {
    tabId: number;
}

export interface DevToolsStatusResponse {
    isActive: boolean;
}
