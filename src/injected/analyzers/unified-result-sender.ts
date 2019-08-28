// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { UnifiedScanCompletedPayload } from '../../background/actions/action-payloads';
import { Messages } from '../../common/messages';
import { UUIDGeneratorType } from '../../common/uid-generator';
import { ConvertResultsDelegate } from '../adapters/scan-results-to-unified-results';
import { AxeAnalyzerResult } from './analyzer';
import { MessageDelegate, PostResolveCallback } from './rule-analyzer';
import { ScanResults } from '../../scanner/iruleresults';
import { UnifiedRule } from '../../common/types/store-data/unified-data-interface';

export class UnifiedResultSender {
    constructor(
        private readonly sendMessage: MessageDelegate,
        private readonly convertScanResultsToUnifiedResults: ConvertResultsDelegate,
        private readonly convertScanResultsToUnifiedRules: (scanResults: ScanResults) => UnifiedRule[],
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
