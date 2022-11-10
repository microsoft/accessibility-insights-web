// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { GetDetailsSwitcherNavConfiguration } from 'DetailsView/components/details-view-switcher-nav';
import { ShadowInitializer } from 'injected/shadow-initializer';
import { BaseStore } from '../common/base-store';
import { VisualizationConfigurationFactory } from '../common/configs/visualization-configuration-factory';
import { EnumHelper } from '../common/enum-helper';
import { FeatureFlagStoreData } from '../common/types/store-data/feature-flag-store-data';
import { ScopingStoreData } from '../common/types/store-data/scoping-store-data';
import { VisualizationStoreData } from '../common/types/store-data/visualization-store-data';
import { VisualizationType } from '../common/types/visualization-type';
import { DictionaryStringTo } from '../types/common-types';
import { AnalyzerStateUpdateHandler } from './analyzer-state-update-handler';
import { Analyzer } from './analyzers/analyzer';
import { AnalyzerProvider } from './analyzers/analyzer-provider';

export class AnalyzerController {
    private analyzerProvider: AnalyzerProvider;
    private analyzers: DictionaryStringTo<Analyzer>;
    private visualizationstore: BaseStore<VisualizationStoreData, Promise<void>>;
    private scopingStore: BaseStore<ScopingStoreData, Promise<void>>;
    private featureFlagStore: BaseStore<FeatureFlagStoreData, Promise<void>>;
    private visualizationConfigurationFactory: VisualizationConfigurationFactory;
    private analyzerStateUpdateHandler: AnalyzerStateUpdateHandler;
    private assessmentsProvider: AssessmentsProvider;

    constructor(
        visualizationstore: BaseStore<VisualizationStoreData, Promise<void>>,
        featureFlagStore: BaseStore<FeatureFlagStoreData, Promise<void>>,
        scopingStore: BaseStore<ScopingStoreData, Promise<void>>,
        visualizationConfigurationFactory: VisualizationConfigurationFactory,
        analyzerProvider: AnalyzerProvider,
        analyzerStateUpdateHandler: AnalyzerStateUpdateHandler,
        assessmentsProvider: AssessmentsProvider,
        private readonly shadowInitializer: ShadowInitializer,
        private readonly getDetailsSwitcherNavConfiguration: GetDetailsSwitcherNavConfiguration,
    ) {
        this.analyzers = {};
        this.visualizationstore = visualizationstore;
        this.scopingStore = scopingStore;
        this.featureFlagStore = featureFlagStore;
        this.visualizationConfigurationFactory = visualizationConfigurationFactory;
        this.analyzerProvider = analyzerProvider;
        this.assessmentsProvider = assessmentsProvider;
        this.analyzerStateUpdateHandler = analyzerStateUpdateHandler;
        this.analyzerStateUpdateHandler.setupHandlers(this.startScan, this.teardown);
    }

    public listenToStore(): void {
        this.initializeAnalyzers();
        this.visualizationstore.addChangedListener(async () => this.onChangedState());
        this.featureFlagStore.addChangedListener(async () => this.onChangedState());
        this.scopingStore.addChangedListener(async () => this.onChangedState());
        this.onChangedState();
    }

    private onChangedState = (): void => {
        if (this.hasInitializedStores() === false) {
            return;
        }

        this.analyzerStateUpdateHandler.handleUpdate(this.visualizationstore.getState());
    };

    protected teardown = (id: string): void => {
        const analyzer = this.getAnalyzerByIdentifier(id);
        analyzer.teardown();
    };

    protected startScan = (id: string): void => {
        this.shadowInitializer.removeExistingShadowHost();

        const analyzer = this.getAnalyzerByIdentifier(id);
        const pivot = this.visualizationstore.getState().selectedDetailsViewPivot;
        const messageConfiguration = this.getDetailsSwitcherNavConfiguration({
            selectedDetailsViewPivot: pivot,
        }).analyzerMessageConfiguration;
        analyzer.analyze(messageConfiguration);

        void this.shadowInitializer.initialize();
    };

    private initializeAnalyzers(): void {
        EnumHelper.getNumericValues(VisualizationType).forEach((test: VisualizationType) => {
            const config = this.visualizationConfigurationFactory.getConfiguration(test);
            if (this.assessmentsProvider.isValidType(test)) {
                this.assessmentsProvider.forType(test).requirements.forEach(stepConfig => {
                    this.analyzers[stepConfig.key] = config.getAnalyzer(
                        this.analyzerProvider,
                        stepConfig.key,
                    );
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
            this.visualizationstore.getState() != null &&
            this.scopingStore.getState() != null &&
            this.featureFlagStore.getState() != null
        );
    }
}
