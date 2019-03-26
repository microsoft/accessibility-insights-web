// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { autobind } from '@uifabric/utilities';
import * as _ from 'lodash';

import { BaseStore } from '../common/base-store';
import { TestMode } from '../common/configs/test-mode';
import { VisualizationConfiguration, VisualizationConfigurationFactory } from '../common/configs/visualization-configuration-factory';
import { EnumHelper } from '../common/enum-helper';
import { FeatureFlagStoreData } from '../common/types/store-data/feature-flag-store-data';
import { ITabStoreData } from '../common/types/store-data/itab-store-data';
import { IVisualizationScanResultData } from '../common/types/store-data/ivisualization-scan-result-data';
import { IAssessmentScanData, IVisualizationStoreData } from '../common/types/store-data/ivisualization-store-data';
import { VisualizationType } from '../common/types/visualization-type';
import { DictionaryNumberTo, DictionaryStringTo } from '../types/common-types';
import { IAssessmentStoreData } from './../common/types/store-data/iassessment-result-data.d';
import { DrawingInitiator } from './drawing-initiator';
import { IAssessmentVisualizationInstance } from './frameCommunicators/html-element-axe-results-helper';
import { ScrollingController, ScrollingWindowMessage } from './frameCommunicators/scrolling-controller';
import { SelectorMapHelper } from './selector-map-helper';
import { TargetPageActionMessageCreator } from './target-page-action-message-creator';

export class ClientViewController {
    private drawingInitiator: DrawingInitiator;
    private scrollingController: ScrollingController;
    private currentVisualizationState: IVisualizationStoreData;
    private currentFeatureFlagState: FeatureFlagStoreData;
    private visualizationStore: BaseStore<IVisualizationStoreData>;
    private assessmentStore: BaseStore<IAssessmentStoreData>;
    private tabStore: BaseStore<ITabStoreData>;
    private scanResultStore: BaseStore<IVisualizationScanResultData>;
    private currentScanResultState: IVisualizationScanResultData;
    private currentAssessmentState: IAssessmentStoreData;
    private currentTabState: ITabStoreData;
    private visualizationConfigurationFactory: VisualizationConfigurationFactory;
    private featureFlagStore: BaseStore<DictionaryStringTo<boolean>>;
    private selectorMapHelper: SelectorMapHelper;
    private targetPageActionMessageCreator: TargetPageActionMessageCreator;
    protected previousVisualizationStates: DictionaryStringTo<boolean> = {};
    protected previousVisualizationSelectorMapStates: DictionaryNumberTo<DictionaryStringTo<IAssessmentVisualizationInstance>> = {};

    constructor(
        visualizationStore: BaseStore<IVisualizationStoreData>,
        scanResultStore: BaseStore<IVisualizationScanResultData>,
        drawingInitiator,
        scrollingController,
        visualizationConfigurationFactory: VisualizationConfigurationFactory,
        featureFlagStore: BaseStore<DictionaryStringTo<boolean>>,
        assessmentStore: BaseStore<IAssessmentStoreData>,
        tabStore: BaseStore<ITabStoreData>,
        selectorMapHelper: SelectorMapHelper,
        targetPageActionMessageCreator: TargetPageActionMessageCreator,
    ) {
        this.featureFlagStore = featureFlagStore;
        this.visualizationStore = visualizationStore;
        this.scanResultStore = scanResultStore;
        this.assessmentStore = assessmentStore;
        this.tabStore = tabStore;
        this.drawingInitiator = drawingInitiator;
        this.scrollingController = scrollingController;
        this.visualizationConfigurationFactory = visualizationConfigurationFactory;
        this.selectorMapHelper = selectorMapHelper;
        this.targetPageActionMessageCreator = targetPageActionMessageCreator;
    }

    public initialize(): void {
        this.setupVisualizationStates();
        this.visualizationStore.addChangedListener(this.onChangedState);
        this.scanResultStore.addChangedListener(this.onChangedState);
        this.assessmentStore.addChangedListener(this.onChangedState);
        this.tabStore.addChangedListener(this.onChangedState);
        this.featureFlagStore.addChangedListener(this.onChangedState);
    }

    private setupVisualizationStates(): void {
        this.previousVisualizationStates = {};
    }

    @autobind
    public onChangedState(): void {
        const oldVisualizationState = this.currentVisualizationState;

        this.currentVisualizationState = this.visualizationStore.getState();
        this.currentFeatureFlagState = this.featureFlagStore.getState();
        this.currentScanResultState = this.scanResultStore.getState();
        this.currentAssessmentState = this.assessmentStore.getState();
        this.currentTabState = this.tabStore.getState();

        if (this.shouldWaitForAllStoreToLoad()) {
            return;
        }

        if (this.currentVisualizationState.scanning == null) {
            this.executeUpdates();
            this.handleFocusChanges(oldVisualizationState);
        }
    }

    private handleFocusChanges(oldVisualizationState: IVisualizationStoreData): void {
        if (
            this.currentVisualizationState == null ||
            oldVisualizationState.focusedTarget !== this.currentVisualizationState.focusedTarget
        ) {
            if (this.currentVisualizationState.focusedTarget != null) {
                this.handleFocusChange(this.currentVisualizationState.focusedTarget);
            }
        }
    }

    private shouldWaitForAllStoreToLoad(): boolean {
        return (
            this.currentVisualizationState == null ||
            this.currentScanResultState == null ||
            this.currentFeatureFlagState == null ||
            this.currentAssessmentState == null ||
            this.currentTabState == null
        );
    }

    private executeUpdates(): void {
        const types = EnumHelper.getNumericValues<VisualizationType>(VisualizationType);
        types.forEach(type => {
            const configuration = this.visualizationConfigurationFactory.getConfiguration(type);
            if (this.isAssessment(configuration)) {
                const visualizationState = configuration.getStoreData(this.currentVisualizationState.tests) as IAssessmentScanData;
                Object.keys(visualizationState.stepStatus).forEach(step => {
                    this.executeUpdate(type, step);
                });
            } else {
                this.executeUpdate(type, null);
            }
            const selectorMap = this.selectorMapHelper.getSelectorMap(type);
            this.previousVisualizationSelectorMapStates[type] = selectorMap;
        });
    }

    private isAssessment(config: VisualizationConfiguration): boolean {
        return config.testMode === TestMode.Assessments;
    }

    private isAssessmentDataForCurrentPage(config: VisualizationConfiguration): boolean {
        return (
            !this.isAssessment(config) ||
            this.currentAssessmentState.persistedTabInfo === null ||
            this.currentTabState.id === this.currentAssessmentState.persistedTabInfo.id
        );
    }

    private executeUpdate(visualizationType: VisualizationType, step: string): void {
        const configuration = this.visualizationConfigurationFactory.getConfiguration(visualizationType);
        const visualizationState = configuration.getStoreData(this.currentVisualizationState.tests);
        const selectorMap = this.selectorMapHelper.getSelectorMap(visualizationType);
        const id = configuration.getIdentifier(step);
        const enabled = configuration.getTestStatus(visualizationState, step) && this.isAssessmentDataForCurrentPage(configuration);

        if (this.isVisualizationStateUnchanged(visualizationType, enabled, selectorMap, id)) {
            return;
        }
        this.previousVisualizationStates[id] = enabled;

        if (enabled) {
            this.drawingInitiator.enableVisualization(
                visualizationType,
                this.currentFeatureFlagState,
                selectorMap,
                id,
                configuration.visualizationInstanceProcessor(step),
            );
        } else {
            this.drawingInitiator.disableVisualization(visualizationType, this.currentFeatureFlagState, id);
        }
    }

    private isVisualizationStateUnchanged(
        type: VisualizationType,
        newVisualizationEnabledState: boolean,
        newSelectorMapState: DictionaryStringTo<IAssessmentVisualizationInstance>,
        id: string,
    ): boolean {
        if (id in this.previousVisualizationStates === false && newVisualizationEnabledState === false) {
            this.previousVisualizationStates[id] = false;
        }
        return (
            id in this.previousVisualizationStates &&
            this.previousVisualizationStates[id] === newVisualizationEnabledState &&
            _.isEqual(this.previousVisualizationSelectorMapStates[type], newSelectorMapState)
        );
    }

    private handleFocusChange(focusedTarget: string[]): void {
        if (focusedTarget) {
            const scrollingMessage: ScrollingWindowMessage = {
                focusedTarget: focusedTarget,
            };
            this.scrollingController.processRequest(scrollingMessage);
            this.targetPageActionMessageCreator.scrollRequested();
        }
    }
}
