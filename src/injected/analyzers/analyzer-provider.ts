// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BaseStore } from '../../common/base-store';
import { VisualizationConfigurationFactory } from '../../common/configs/visualization-configuration-factory';
import { TelemetryDataFactory } from '../../common/telemetry-data-factory';
import { ScopingStoreData } from '../../common/types/store-data/scoping-store-data';
import { WindowUtils } from '../../common/window-utils';
import { ScannerUtils } from '../scanner-utils';
import { TabStopsListener } from '../tab-stops-listener';
import { Analyzer, AnalyzerConfiguration, FocusAnalyzerConfiguration, RuleAnalyzerConfiguration, AxeAnalyzerResult } from './analyzer';
import { BaseAnalyzer } from './base-analyzer';
import { BatchedRuleAnalyzer, IResultRuleFilter } from './batched-rule-analyzer';
import { RuleAnalyzer, PostResolveCallback } from './rule-analyzer';
import { TabStopsAnalyzer } from './tab-stops-analyzer';

export class AnalyzerProvider {
    private tabStopsListener: TabStopsListener;
    private scopingStore: BaseStore<ScopingStoreData>;
    private sendMessageDelegate: (message) => void;
    private scanner: ScannerUtils;
    private telemetryDataFactory: TelemetryDataFactory;
    private dateGetter: () => Date;

    constructor(
        tabStopsListener: TabStopsListener,
        scopingStore: BaseStore<ScopingStoreData>,
        sendMessageDelegate: (message) => void,
        scanner: ScannerUtils,
        telemetryDataFactory: TelemetryDataFactory,
        dateGetter: () => Date,
        private readonly visualizationConfigFactory: VisualizationConfigurationFactory,
        private filterResultsByRules: IResultRuleFilter,
    ) {
        this.tabStopsListener = tabStopsListener;
        this.scopingStore = scopingStore;
        this.sendMessageDelegate = sendMessageDelegate;
        this.scanner = scanner;
        this.telemetryDataFactory = telemetryDataFactory;
        this.dateGetter = dateGetter;
    }

    public createRuleAnalyzer(config: RuleAnalyzerConfiguration): Analyzer {
        return new RuleAnalyzer(
            config,
            this.scanner,
            this.scopingStore,
            this.sendMessageDelegate,
            this.dateGetter,
            this.telemetryDataFactory,
            this.visualizationConfigFactory,
            null,
        );
    }

    public createRuleAnalyzerPostResolve(config: RuleAnalyzerConfiguration, postOnResolve: PostResolveCallback) {
        return new RuleAnalyzer(
            config,
            this.scanner,
            this.scopingStore,
            this.sendMessageDelegate,
            this.dateGetter,
            this.telemetryDataFactory,
            this.visualizationConfigFactory,
            postOnResolve,
        );
    }

    public createBatchedRuleAnalyzer(config: RuleAnalyzerConfiguration): Analyzer {
        return new BatchedRuleAnalyzer(
            config,
            this.scanner,
            this.scopingStore,
            this.sendMessageDelegate,
            this.dateGetter,
            this.telemetryDataFactory,
            this.visualizationConfigFactory,
            this.filterResultsByRules,
        );
    }

    public createFocusTrackingAnalyzer(config: FocusAnalyzerConfiguration): Analyzer {
        return new TabStopsAnalyzer(config, this.tabStopsListener, new WindowUtils(), this.sendMessageDelegate);
    }

    public createBaseAnalyzer(config: AnalyzerConfiguration): Analyzer {
        return new BaseAnalyzer(config, this.sendMessageDelegate);
    }
}
