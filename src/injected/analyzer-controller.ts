// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { autobind } from '@uifabric/utilities';
import { AssessmentsProvider } from '../assessments/types/iassessments-provider';
import { EnumHelper } from '../common/enum-helper';
import { IBaseStore } from '../common/istore';
import { FeatureFlagStoreData } from '../common/types/store-data/feature-flag-store-data';
import { IVisualizationStoreData } from '../common/types/store-data/ivisualization-store-data';
import { IScopingStoreData } from '../common/types/store-data/scoping-store-data';
import { VisualizationType } from '../common/types/visualization-type';
import { DictionaryStringTo } from '../types/common-types';
import { VisualizationConfigurationFactory } from './../common/configs/visualization-configuration-factory';
import { AnalyzerStateUpdateHandler } from './analyzer-state-update-handler';
import { Analyzer } from './analyzers/analyzer';
import { AnalyzerProvider } from './analyzers/analyzer-provider';
import { TabStopsListener } from './tab-stops-listener';

export class AnalyzerController {
    private analyzerProvider: AnalyzerProvider;
    private tabStopsListener: TabStopsListener;
    private analyzers: DictionaryStringTo<Analyzer>;
    private sendMessage: (message) => void;
    private visualizationstore: IBaseStore<IVisualizationStoreData>;
    private scopingStore: IBaseStore<IScopingStoreData>;
    private featureFlagStore: IBaseStore<FeatureFlagStoreData>;
    private visualizationConfigurationFactory: VisualizationConfigurationFactory;
    private analyzerStateUpdateHandler: AnalyzerStateUpdateHandler;
    private assessmentsProvider: AssessmentsProvider;

    constructor(
        sendMessage: (message) => void,
        visualizationstore: IBaseStore<IVisualizationStoreData>,
        featureFlagStore: IBaseStore<FeatureFlagStoreData>,
        scopingStore: IBaseStore<IScopingStoreData>,
        tabStopsListener: TabStopsListener,
        visualizationConfigurationFactory: VisualizationConfigurationFactory,
        analyzerProvider: AnalyzerProvider,
        analyzerStateUpdateHandler: AnalyzerStateUpdateHandler,
        assessmentsProvider: AssessmentsProvider,
    ) {
        this.analyzers = {};
        this.sendMessage = sendMessage;
        this.visualizationstore = visualizationstore;
        this.scopingStore = scopingStore;
        this.featureFlagStore = featureFlagStore;
        this.tabStopsListener = tabStopsListener;
        this.visualizationConfigurationFactory = visualizationConfigurationFactory;
        this.analyzerProvider = analyzerProvider;
        this.assessmentsProvider = assessmentsProvider;
        this.analyzerStateUpdateHandler = analyzerStateUpdateHandler;
        this.analyzerStateUpdateHandler.setupHandlers(this.startScan, this.teardown);
    }

    public listenToStore(): void {
        this.initializeAnalyzers();
        this.visualizationstore.addChangedListener(this.onChangedState);
        this.featureFlagStore.addChangedListener(this.onChangedState);
        this.scopingStore.addChangedListener(this.onChangedState);
        this.onChangedState();
    }

    @autobind
    private onChangedState(): void {
        if (this.hasInitializedStores() === false) {
            return;
        }

        this.analyzerStateUpdateHandler.handleUpdate(this.visualizationstore.getState());
    }

    @autobind
    protected teardown(id: string): void {
        const analyzer = this.getAnalyzerByIdentifier(id);
        analyzer.teardown();
    }

    @autobind
    protected startScan(id: string): void {
        const analyzer = this.getAnalyzerByIdentifier(id);
        analyzer.analyze();
    }

    private initializeAnalyzers(): void {
        EnumHelper.getNumericValues(VisualizationType).forEach((test: VisualizationType) => {
            const config = this.visualizationConfigurationFactory.getConfiguration(test);
            if (this.assessmentsProvider.isValidType(test)) {
                this.assessmentsProvider.forType(test).steps.forEach(stepConfig => {
                    this.analyzers[stepConfig.key] = config.getAnalyzer(this.analyzerProvider, stepConfig.key);
                });
            } else {
                const key = config.getIdentifier();
                this.analyzers[key] = config.getAnalyzer(this.analyzerProvider);
            }
        });
    }

    private getAnalyzerByIdentifier(key: string): Analyzer {
        if (!this.analyzers[key]) {
            return null;
        }
        return this.analyzers[key];
    }

    private hasInitializedStores(): boolean {
        return (
            this.visualizationstore.getState() != null && this.scopingStore.getState() != null && this.featureFlagStore.getState() != null
        );
    }
}
