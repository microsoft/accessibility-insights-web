// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BaseStore } from '../../common/base-store';
import { VisualizationConfigurationFactory } from '../../common/configs/visualization-configuration-factory';
import { Messages } from '../../common/messages';
import { TelemetryDataFactory } from '../../common/telemetry-data-factory';
import { ScopingStoreData } from '../../common/types/store-data/scoping-store-data';
import { ScannerUtils } from '../scanner-utils';
import { AxeAnalyzerResult, RuleAnalyzerConfiguration } from './analyzer';
import { RuleAnalyzer } from './rule-analyzer';

export class UnifiedRuleAnalyzer extends RuleAnalyzer {
    constructor(
        protected config: RuleAnalyzerConfiguration,
        protected scanner: ScannerUtils,
        protected scopingStore: BaseStore<ScopingStoreData>,
        protected sendMessageDelegate: (message) => void,
        protected dateGetter: () => Date,
        protected telemetryFactory: TelemetryDataFactory,
        protected readonly visualizationConfigFactory: VisualizationConfigurationFactory,
    ) {
        super(config, scanner, scopingStore, sendMessageDelegate, dateGetter, telemetryFactory, visualizationConfigFactory);
    }

    protected onResolve = (analyzerResult: AxeAnalyzerResult): void => {
        this.sendScanCompleteResolveMessage(analyzerResult, this.config);
        this.sendMessage({
            messageType: Messages.UnifiedScan.ScanCompleted,
            payload: {
                results: null,
            },
        });
    };
}
