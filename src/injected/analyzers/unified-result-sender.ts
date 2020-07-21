// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ScanIncompleteWarningsTelemetryData } from 'common/extension-telemetry-events';
import { ToolData } from 'common/types/store-data/unified-data-interface';
import { ResolutionCreator } from 'injected/adapters/resolution-creator';
import { FilterResults } from 'injected/analyzers/filter-results';
import { ScanIncompleteWarningDetector } from 'injected/scan-incomplete-warning-detector';
import { isEmpty } from 'lodash';
import { ScanResults } from 'scanner/iruleresults';
import { UnifiedScanCompletedPayload } from '../../background/actions/action-payloads';
import { Messages } from '../../common/messages';
import { UUIDGenerator } from '../../common/uid-generator';
import {
    ConvertScanResultsToUnifiedResults,
    ConvertScanResultsToUnifiedResultsDelegate,
} from '../adapters/scan-results-to-unified-results';
import { ConvertScanResultsToUnifiedRulesDelegate } from '../adapters/scan-results-to-unified-rules';
import { AxeAnalyzerResult } from './analyzer';
import { MessageDelegate, PostResolveCallback } from './rule-analyzer';

export class UnifiedResultSender {
    constructor(
        private readonly sendMessage: MessageDelegate,
        private readonly convertScanResultsToUnifiedRules: ConvertScanResultsToUnifiedRulesDelegate,
        private readonly toolData: ToolData,
        private readonly convertScanResultsToUnifiedResults: ConvertScanResultsToUnifiedResults,
        private readonly scanIncompleteWarningDetector: ScanIncompleteWarningDetector,
        private readonly filterNeedsReviewResults: FilterResults,
    ) {}

    public sendAutomatedChecksResults: PostResolveCallback = (axeResults: AxeAnalyzerResult) => {
        this.sendResults(
            axeResults.originalResult,
            this.convertScanResultsToUnifiedResults.automatedChecksConversion,
        );
    };

    public sendNeedsReviewResults: PostResolveCallback = (axeResults: AxeAnalyzerResult) => {
        this.sendResults(
            this.filterNeedsReviewResults(axeResults.originalResult),
            this.convertScanResultsToUnifiedResults.needsReviewConversion,
        );
    };

    private sendResults = (
        results: ScanResults,
        converter: ConvertScanResultsToUnifiedResultsDelegate,
    ) => {
        const scanIncompleteWarnings = this.scanIncompleteWarningDetector.detectScanIncompleteWarnings();

        let telemetry: ScanIncompleteWarningsTelemetryData = null;

        if (!isEmpty(scanIncompleteWarnings)) {
            telemetry = {
                scanIncompleteWarnings,
            };
        }

        const payload: UnifiedScanCompletedPayload = {
            scanResult: converter(results),
            rules: this.convertScanResultsToUnifiedRules(results),
            toolInfo: this.toolData,
            timestamp: results.timestamp,
            targetAppInfo: {
                name: results.targetPageTitle,
                url: results.targetPageUrl,
            },
            scanIncompleteWarnings,
            telemetry,
        };

        this.sendMessage({
            messageType: Messages.UnifiedScan.ScanCompleted,
            payload,
        });
    };
}
