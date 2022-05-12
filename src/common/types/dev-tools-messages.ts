// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { Message } from 'common/message';

export interface DevToolsStatusRequest extends Message {
    tabId: number;
}

export interface DevToolsStatusResponse {
    isActive: boolean;
}
