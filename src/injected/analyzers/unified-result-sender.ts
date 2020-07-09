// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ScanIncompleteWarningsTelemetryData } from 'common/extension-telemetry-events';
import { ToolData } from 'common/types/store-data/unified-data-interface';
import { ScanIncompleteWarningDetector } from 'injected/scan-incomplete-warning-detector';
import { isEmpty } from 'lodash';
import { ScanResults } from 'scanner/iruleresults';
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
        this.sendResults(axeResults.originalResult, this.convertScanResultsToUnifiedResults);
    };

    public sendNeedsReviewResults: PostResolveCallback = (axeResults: AxeAnalyzerResult) => {
        this.sendResults(
            this.filterNeedsReviewResults(axeResults.originalResult),
            this.convertScanResultsToNeedsReviewUnifiedResults,
        );
    };

    private filterNeedsReviewResults = (results: ScanResults): ScanResults => {
        if (results.violations) {
            // const x = results.originalResult.violations.filter(() => true);
            // console.log('og AxeAnalyzerResult violations', x);
            results.violations = results.violations.filter(v => v.id === 'link-in-text-block');
        }
        if (results.incomplete) {
            // const y = results.originalResult.incomplete.filter(() => true);
            // console.log('og AxeAnalyzerResult incomplete', y);
            results.incomplete = results.incomplete.filter(
                i =>
                    i.id === 'aria-input-field-name' ||
                    i.id === 'color-contrast' ||
                    i.id === 'th-has-data-cells',
            );
        }

        console.log('filtered AxeAnalyzerResult', results);

        return results;
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
            scanResult: converter(results, this.generateUID),
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

        console.log('unified scan completed payload: ', payload);

        this.sendMessage({
            messageType: Messages.UnifiedScan.ScanCompleted,
            payload,
        });
    };
}
