// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ScanIncompleteWarningsTelemetryData } from 'common/extension-telemetry-events';
import { ToolData } from 'common/types/store-data/unified-data-interface';
import { FilterResults } from 'injected/analyzers/filter-results';
import {
    NotificationTextCreator,
    TextGenerator,
} from 'injected/analyzers/notification-text-creator';
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
        private readonly notificationTextCreator: NotificationTextCreator,
        private readonly filterNeedsReviewResults: FilterResults,
    ) {}

    public sendAutomatedChecksResults: PostResolveCallback = (axeResults: AxeAnalyzerResult) => {
        this.sendResults(
            axeResults.originalResult,
            this.convertScanResultsToUnifiedResults,
            this.notificationTextCreator.automatedChecksText,
        );
    };

    public sendNeedsReviewResults: PostResolveCallback = (axeResults: AxeAnalyzerResult) => {
        this.sendResults(
            this.filterNeedsReviewResults(axeResults.originalResult),
            this.convertScanResultsToNeedsReviewUnifiedResults,
            this.notificationTextCreator.needsReviewText,
        );
    };

    private sendResults = (
        results: ScanResults,
        converter: ConvertScanResultsToUnifiedResultsDelegate,
        notificationMessage: TextGenerator,
    ) => {
        const scanIncompleteWarnings = this.scanIncompleteWarningDetector.detectScanIncompleteWarnings();

        let telemetry: ScanIncompleteWarningsTelemetryData = null;

        if (!isEmpty(scanIncompleteWarnings)) {
            telemetry = {
                scanIncompleteWarnings,
            };
        }

        const unifiedResults = converter(results, this.generateUID);

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
