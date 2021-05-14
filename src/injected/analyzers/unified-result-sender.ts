// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { UnifiedScanCompletedPayload } from 'background/actions/action-payloads';
import { ScanIncompleteWarningsTelemetryData } from 'common/extension-telemetry-events';
import { Messages } from 'common/messages';
import { AxeAnalyzerResult } from 'common/types/axe-analyzer-result';
import { ToolData } from 'common/types/store-data/unified-data-interface';
import { FilterResults } from 'injected/analyzers/filter-results';
import {
    NotificationTextCreator,
    TextGenerator,
} from 'injected/analyzers/notification-text-creator';
import { ScanIncompleteWarningDetector } from 'injected/scan-incomplete-warning-detector';
import { isEmpty } from 'lodash';
import { ScanResults } from 'scanner/iruleresults';

import {
    ConvertScanResultsToUnifiedResults,
    ConvertScanResultsToUnifiedResultsDelegate,
} from '../adapters/scan-results-to-unified-results';
import { ConvertScanResultsToUnifiedRulesDelegate } from '../adapters/scan-results-to-unified-rules';
import { MessageDelegate, PostResolveCallback } from './rule-analyzer';

export class UnifiedResultSender {
    constructor(
        private readonly sendMessage: MessageDelegate,
        private readonly convertScanResultsToUnifiedRules: ConvertScanResultsToUnifiedRulesDelegate,
        private readonly toolData: ToolData,
        private readonly convertScanResultsToUnifiedResults: ConvertScanResultsToUnifiedResults,
        private readonly scanIncompleteWarningDetector: ScanIncompleteWarningDetector,
        private readonly notificationTextCreator: NotificationTextCreator,
        private readonly filterNeedsReviewResults: FilterResults,
    ) {}

    public sendAutomatedChecksResults: PostResolveCallback = (axeResults: AxeAnalyzerResult) => {
        this.sendResults(
            axeResults.originalResult,
            this.convertScanResultsToUnifiedResults.automatedChecksConversion,
            this.notificationTextCreator.automatedChecksText,
        );
    };

    public sendNeedsReviewResults: PostResolveCallback = (axeResults: AxeAnalyzerResult) => {
        this.sendResults(
            this.filterNeedsReviewResults(axeResults.originalResult),
            this.convertScanResultsToUnifiedResults.needsReviewConversion,
            this.notificationTextCreator.needsReviewText,
        );
    };

    private sendResults = (
        results: ScanResults,
        converter: ConvertScanResultsToUnifiedResultsDelegate,
        notificationMessage: TextGenerator,
    ) => {
        const scanIncompleteWarnings =
            this.scanIncompleteWarningDetector.detectScanIncompleteWarnings();

        let telemetry: ScanIncompleteWarningsTelemetryData = null;

        if (!isEmpty(scanIncompleteWarnings)) {
            telemetry = {
                scanIncompleteWarnings,
            };
        }

        const unifiedResults = converter(results);

        const payload: UnifiedScanCompletedPayload = {
            scanResult: unifiedResults,
            rules: this.convertScanResultsToUnifiedRules(results),
            toolInfo: this.toolData,
            timestamp: results.timestamp,
            targetAppInfo: {
                name: results.targetPageTitle,
                url: results.targetPageUrl,
            },
            scanIncompleteWarnings,
            telemetry,
            notificationText: notificationMessage(unifiedResults),
        };

        this.sendMessage({
            messageType: Messages.UnifiedScan.ScanCompleted,
            payload,
        });
    };
}
