// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { autobind } from '@uifabric/utilities';

import { VisualizationConfigurationFactory } from '../../common/configs/visualization-configuration-factory';
import { IBaseStore } from '../../common/istore';
import { TelemetryDataFactory } from '../../common/telemetry-data-factory';
import { IScopingStoreData } from '../../common/types/store-data/scoping-store-data';
import { ScanResults } from '../../scanner/iruleresults';
import { ScannerUtils } from '../scanner-utils';
import { RuleAnalyzer } from './rule-analyzer';
import { AxeAnalyzerResult, RuleAnalyzerConfiguration } from './ianalyzer';

export type IResultRuleFilter = (results: ScanResults, rules: string[]) => ScanResults;

export class BatchedRuleAnalyzer extends RuleAnalyzer {
    private static batchConfigs: RuleAnalyzerConfiguration[] = [];

    constructor(
        protected config: RuleAnalyzerConfiguration,
        protected scanner: ScannerUtils,
        protected scopingStore: IBaseStore<IScopingStoreData>,
        protected sendMessageDelegate: (message) => void,
        protected dateGetter: () => Date,
        protected telemetryFactory: TelemetryDataFactory,
        protected readonly visualizationConfigFactory: VisualizationConfigurationFactory,
        private postScanFilter: IResultRuleFilter,
    ) {
        super(config, scanner, scopingStore, sendMessageDelegate, dateGetter, telemetryFactory, visualizationConfigFactory);
        BatchedRuleAnalyzer.batchConfigs.push(config);
    }

    protected getRulesToRun(): string[] {
        return null;
    }

    @autobind
    protected onResolve(results: AxeAnalyzerResult) {
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
    }
}
