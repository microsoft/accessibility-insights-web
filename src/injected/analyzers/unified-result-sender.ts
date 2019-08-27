// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Messages } from '../../common/messages';
import { AxeAnalyzerResult } from './analyzer';
import { MessageDelegate, PostResolveCallback } from './rule-analyzer';
import { ConvertResultsDelegate } from '../adapters/scan-results-to-unified-results';
import { UUIDGeneratorType } from '../../common/uid-generator';

export class UnifiedResultSender {
    constructor(
        private readonly sendMessage: MessageDelegate,
        private readonly convertScanResultsToUnifiedResults: ConvertResultsDelegate,
        private readonly generateUID: UUIDGeneratorType,
    ) {}

    public sendResults: PostResolveCallback = (axeResults: AxeAnalyzerResult) => {
        this.sendMessage({
            messageType: Messages.UnifiedScan.ScanCompleted,
            payload: this.convertScanResultsToUnifiedResults(axeResults.originalResult, this.generateUID),
        });
    };
}
