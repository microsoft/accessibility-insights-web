// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Messages } from '../../common/messages';
import { PostResolveCallback } from './rule-analyzer';

export const sendConvertedResults: PostResolveCallback = (axeResults, sendMessageDelegate) => {
    sendMessageDelegate({
        messageType: Messages.UnifiedScan.ScanCompleted,
        payload: {
            results: null,
        },
    });
};
