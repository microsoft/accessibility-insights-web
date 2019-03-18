// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { VisualizationConfigurationFactory } from '../../common/configs/visualization-configuration-factory';
import { IBaseStore } from '../../common/istore';
import { TelemetryDataFactory } from '../../common/telemetry-data-factory';
import { IScopingStoreData } from '../../common/types/store-data/scoping-store-data';
import { WindowUtils } from '../../common/window-utils';
import { ScannerUtils } from '../scanner-utils';
import { TabStopsListener } from '../tab-stops-listener';
import { BaseAnalyzer } from './base-analyzer';
import { BatchedRuleAnalyzer, IResultRuleFilter } from './batched-rule-analyzer';
import { IAnalyzer, IAnalyzerConfiguration, IFocusAnalyzerConfiguration, RuleAnalyzerConfiguration } from './ianalyzer';
import { RuleAnalyzer } from './rule-analyzer';
import { TabStopsAnalyzer } from './tab-stops-analyzer';

export class AnalyzerProvider {
    private tabStopsListener: TabStopsListener;
    private scopingStore: IBaseStore<IScopingStoreData>;
    private sendMessageDelegate: (message) => void;
    private scanner: ScannerUtils;
    private telemetryDataFactory: TelemetryDataFactory;
    private dateGetter: () => Date;

    constructor(
        tabStopsListener: TabStopsListener,
        scopingStore: IBaseStore<IScopingStoreData>,
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

    public createRuleAnalyzer(config: RuleAnalyzerConfiguration): IAnalyzer<any> {
        return new RuleAnalyzer(
            config,
            this.scanner,
            this.scopingStore,
            this.sendMessageDelegate,
            this.dateGetter,
            this.telemetryDataFactory,
            this.visualizationConfigFactory,
        );
    }

    public createBatchedRuleAnalyzer(config: RuleAnalyzerConfiguration): IAnalyzer<any> {
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

    public createFocusTrackingAnalyzer(config: IFocusAnalyzerConfiguration): IAnalyzer<any> {
        return new TabStopsAnalyzer(config, this.tabStopsListener, new WindowUtils(), this.sendMessageDelegate);
    }

    public createBaseAnalyzer(config: IAnalyzerConfiguration): IAnalyzer<any> {
        return new BaseAnalyzer(config, this.sendMessageDelegate);
    }
}
