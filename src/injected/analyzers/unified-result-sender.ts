// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ScanIncompleteWarningsTelemetryData } from 'common/extension-telemetry-events';
import { ToolData } from 'common/types/store-data/unified-data-interface';
import { ScanIncompleteWarningDetector } from 'injected/scan-incomplete-warning-detector';
import { isEmpty } from 'lodash';
import { UnifiedScanCompletedPayload } from '../../background/actions/action-payloads';
import { Messages } from '../../common/messages';
import { UUIDGenerator } from '../../common/uid-generator';
import { ConvertScanResultsToUnifiedResultsDelegate } from '../adapters/scan-results-to-unified-results';
import { ConvertScanResultsToUnifiedRulesDelegate } from '../adapters/scan-results-to-unified-rules';
import { AxeAnalyzerResult } from './analyzer';
import { MessageDelegate, PostResolveCallback } from './rule-analyzer';
export class UnifiedResultSender {
    constructor(
        private readonly sendMessage: MessageDelegate,
        private readonly convertScanResultsToUnifiedResults: ConvertScanResultsToUnifiedResultsDelegate,
        private readonly convertScanResultsToNeedsReviewUnifiedResults: ConvertScanResultsToUnifiedResultsDelegate,
        private readonly convertScanResultsToUnifiedRules: ConvertScanResultsToUnifiedRulesDelegate,
        private readonly toolData: ToolData,
        private readonly generateUID: UUIDGenerator,
        private readonly scanIncompleteWarningDetector: ScanIncompleteWarningDetector,
    ) {}

    public sendAutomatedChecksResults: PostResolveCallback = (axeResults: AxeAnalyzerResult) => {
        this.sendResults(axeResults, this.convertScanResultsToUnifiedResults);
    };

    public sendNeedsReviewResults: PostResolveCallback = (axeResults: AxeAnalyzerResult) => {
        this.sendResults(
            this.filterNeedsReviewResults(axeResults),
            this.convertScanResultsToNeedsReviewUnifiedResults,
        );
    };

    private filterNeedsReviewResults = (results: AxeAnalyzerResult): AxeAnalyzerResult => {
        const x = results.originalResult.violations.filter(() => true);
        console.log('og AxeAnalyzerResult violations', x);
        const y = results.originalResult.incomplete.filter(() => true);
        console.log('og AxeAnalyzerResult incomplete', y);

        results.originalResult.violations = results.originalResult.violations.filter(
            v => v.id === 'link-in-text-block',
        );
        results.originalResult.incomplete = results.originalResult.incomplete.filter(
            i =>
                i.id === 'aria-input-field-name' ||
                i.id === 'color-contrast' ||
                i.id === 'th-has-data-cells',
        );

        console.log('filtered AxeAnalyzerResult', results);

        return results;
    };

    private sendResults = (
        axeResults: AxeAnalyzerResult,
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
            scanResult: converter(axeResults.originalResult, this.generateUID),
            rules: this.convertScanResultsToUnifiedRules(axeResults.originalResult),
            toolInfo: this.toolData,
            timestamp: axeResults.originalResult.timestamp,
            targetAppInfo: {
                name: axeResults.originalResult.targetPageTitle,
                url: axeResults.originalResult.targetPageUrl,
            },
            scanIncompleteWarnings,
            telemetry,
        };

        console.log('unified scan completed payload: ', payload);

        this.sendMessage({
            messageType: Messages.UnifiedScan.ScanCompleted,
            payload,
        });
    };
}
