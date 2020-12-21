// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BaseStore } from 'common/base-store';
import { Logger } from 'common/logging/logger';
import { TelemetryDataFactory } from 'common/telemetry-data-factory';
import { AxeAnalyzerResult } from 'common/types/axe-analyzer-result';
import { ScopingStoreData } from 'common/types/store-data/scoping-store-data';
import { ScanIncompleteWarningDetector } from 'injected/scan-incomplete-warning-detector';
import { ScanResults } from 'scanner/iruleresults';

import { ScannerUtils } from '../scanner-utils';
import { RuleAnalyzerConfiguration } from './analyzer';
import { RuleAnalyzer } from './rule-analyzer';

export type IResultRuleFilter = (results: ScanResults, rules: string[]) => ScanResults;

export class BatchedRuleAnalyzer extends RuleAnalyzer {
    private static batchConfigs: RuleAnalyzerConfiguration[] = [];

    constructor(
        protected config: RuleAnalyzerConfiguration,
        protected scanner: ScannerUtils,
        protected scopingStore: BaseStore<ScopingStoreData>,
        protected sendMessageDelegate: (message) => void,
        protected dateGetter: () => Date,
        protected telemetryFactory: TelemetryDataFactory,
        private postScanFilter: IResultRuleFilter,
        scanIncompleteWarningDetector: ScanIncompleteWarningDetector,
        logger: Logger,
    ) {
        super(
            config,
            scanner,
            scopingStore,
            sendMessageDelegate,
            dateGetter,
            telemetryFactory,
            null,
            scanIncompleteWarningDetector,
            logger,
        );
        BatchedRuleAnalyzer.batchConfigs.push(config);
    }

    protected getRulesToRun(): string[] {
        return null;
    }

    protected onResolve = (results: AxeAnalyzerResult): void => {
        BatchedRuleAnalyzer.batchConfigs.forEach(config => {
            const filteredScannerResult = this.postScanFilter(results.originalResult, config.rules);
            const processResults = config.resultProcessor(this.scanner);
            const filteredAxeAnalyzerResult: AxeAnalyzerResult = {
                ...results,
                originalResult: filteredScannerResult,
                results: processResults(filteredScannerResult),
            };
            this.sendScanCompleteResolveMessage(filteredAxeAnalyzerResult, config);
        });
    };
}
