// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { UnifiedScanCompletedPayload } from '../../background/actions/action-payloads';
import { Messages } from '../../common/messages';
import { UUIDGeneratorType } from '../../common/uid-generator';
import { ConvertScanResultsToUnifiedResultsDelegate } from '../adapters/scan-results-to-unified-results';
import { ConvertScanResultsToUnifiedRulesDelegate } from '../adapters/scan-results-to-unified-rules';
import { AxeAnalyzerResult } from './analyzer';
import { MessageDelegate, PostResolveCallback } from './rule-analyzer';

export class UnifiedResultSender {
    constructor(
        private readonly sendMessage: MessageDelegate,
        private readonly convertScanResultsToUnifiedResults: ConvertScanResultsToUnifiedResultsDelegate,
        private readonly convertScanResultsToUnifiedRules: ConvertScanResultsToUnifiedRulesDelegate,
        private readonly generateUID: UUIDGeneratorType,
    ) {}

    public sendResults: PostResolveCallback = (axeResults: AxeAnalyzerResult) => {
        const payload: UnifiedScanCompletedPayload = {
            scanResult: this.convertScanResultsToUnifiedResults(axeResults.originalResult, this.generateUID),
            rules: this.convertScanResultsToUnifiedRules(axeResults.originalResult),
        };

        this.sendMessage({
            messageType: Messages.UnifiedScan.ScanCompleted,
            payload,
        });
    };
}
