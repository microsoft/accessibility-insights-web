// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Messages } from '../../common/messages';
import { AxeAnalyzerResult } from './analyzer';
import { MessageDelegate, PostResolveCallback } from './rule-analyzer';

export class UnifiedResultSender {
    constructor(private readonly sendMessage: MessageDelegate) {}

    public sendResults: PostResolveCallback = (axeResults: AxeAnalyzerResult) => {
        this.sendMessage({
            messageType: Messages.UnifiedScan.ScanCompleted,
            payload: {
                results: null,
            },
        });
    };
}
