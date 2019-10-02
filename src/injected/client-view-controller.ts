// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as _ from 'lodash';
import { BaseStore } from '../common/base-store';
import { TestMode } from '../common/configs/test-mode';
import { VisualizationConfiguration } from '../common/configs/visualization-configuration';
import { VisualizationConfigurationFactory } from '../common/configs/visualization-configuration-factory';
import { EnumHelper } from '../common/enum-helper';
import { AssessmentStoreData } from '../common/types/store-data/assessment-result-data';
import { FeatureFlagStoreData } from '../common/types/store-data/feature-flag-store-data';
import { TabStoreData } from '../common/types/store-data/tab-store-data';
import { VisualizationScanResultData } from '../common/types/store-data/visualization-scan-result-data';
import { AssessmentScanData, VisualizationStoreData } from '../common/types/store-data/visualization-store-data';
import { VisualizationType } from '../common/types/visualization-type';
import { DictionaryNumberTo, DictionaryStringTo } from '../types/common-types';
import { UserConfigurationStoreData } from './../common/types/store-data/user-configuration-store';
import { DrawingInitiator } from './drawing-initiator';
import { AssessmentVisualizationInstance } from './frameCommunicators/html-element-axe-results-helper';
import { ScrollingController, ScrollingWindowMessage } from './frameCommunicators/scrolling-controller';
import { SelectorMapHelper } from './selector-map-helper';
import { TargetPageActionMessageCreator } from './target-page-action-message-creator';

export class ClientViewController {
    private drawingInitiator: DrawingInitiator;
    private scrollingController: ScrollingController;
    private currentVisualizationState: VisualizationStoreData;
    private currentFeatureFlagState: FeatureFlagStoreData;
    private visualizationStore: BaseStore<VisualizationStoreData>;
    private assessmentStore: BaseStore<AssessmentStoreData>;
    private tabStore: BaseStore<TabStoreData>;
    private userConfigurationStore: BaseStore<UserConfigurationStoreData>;
    private scanResultStore: BaseStore<VisualizationScanResultData>;
    private currentScanResultState: VisualizationScanResultData;
    private currentAssessmentState: AssessmentStoreData;
    private currentTabState: TabStoreData;
    private currentUserConfigStoreState: UserConfigurationStoreData;
    private visualizationConfigurationFactory: VisualizationConfigurationFactory;
    private featureFlagStore: BaseStore<DictionaryStringTo<boolean>>;
    private selectorMapHelper: SelectorMapHelper;
    private targetPageActionMessageCreator: TargetPageActionMessageCreator;
    protected previousVisualizationStates: DictionaryStringTo<boolean> = {};
    protected previousVisualizationSelectorMapStates: DictionaryNumberTo<DictionaryStringTo<AssessmentVisualizationInstance>> = {};

    constructor(
        visualizationStore: BaseStore<VisualizationStoreData>,
        scanResultStore: BaseStore<VisualizationScanResultData>,
        drawingInitiator,
        scrollingController,
        visualizationConfigurationFactory: VisualizationConfigurationFactory,
        featureFlagStore: BaseStore<DictionaryStringTo<boolean>>,
        assessmentStore: BaseStore<AssessmentStoreData>,
        tabStore: BaseStore<TabStoreData>,
        userConfigurationStore: BaseStore<UserConfigurationStoreData>,
        selectorMapHelper: SelectorMapHelper,
        targetPageActionMessageCreator: TargetPageActionMessageCreator,
    ) {
        this.featureFlagStore = featureFlagStore;
        this.visualizationStore = visualizationStore;
        this.scanResultStore = scanResultStore;
        this.assessmentStore = assessmentStore;
        this.userConfigurationStore = userConfigurationStore;
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
        this.userConfigurationStore.addChangedListener(this.onChangedState);
    }

    private setupVisualizationStates(): void {
        this.previousVisualizationStates = {};
    }

    public onChangedState = (): void => {
        const oldVisualizationState = this.currentVisualizationState;

        this.currentVisualizationState = this.visualizationStore.getState();
        this.currentFeatureFlagState = this.featureFlagStore.getState();
        this.currentScanResultState = this.scanResultStore.getState();
        this.currentAssessmentState = this.assessmentStore.getState();
        this.currentTabState = this.tabStore.getState();
        this.currentUserConfigStoreState = this.userConfigurationStore.getState();

        if (this.shouldWaitForAllStoreToLoad()) {
            return;
        }

        if (this.currentVisualizationState.scanning == null) {
            this.executeUpdates();
            this.handleFocusChanges(oldVisualizationState);
        }
    };

    private handleFocusChanges(oldVisualizationState: VisualizationStoreData): void {
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
            this.currentTabState == null ||
            this.currentUserConfigStoreState == null
        );
    }

    private executeUpdates(): void {
        const types = EnumHelper.getNumericValues<VisualizationType>(VisualizationType);
        types.forEach(visualizationType => {
            const configuration = this.visualizationConfigurationFactory.getConfiguration(visualizationType);
            if (this.isAssessment(configuration)) {
                const visualizationState = configuration.getStoreData(this.currentVisualizationState.tests) as AssessmentScanData;
                Object.keys(visualizationState.stepStatus).forEach(step => {
                    this.executeUpdate(visualizationType, step);
                });
            } else {
                this.executeUpdate(visualizationType, null);
            }
            const selectorMap = this.selectorMapHelper.getSelectorMap(
                visualizationType,
                this.currentScanResultState,
                this.currentAssessmentState,
            );
            this.previousVisualizationSelectorMapStates[visualizationType] = selectorMap;
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
        const selectorMap = this.selectorMapHelper.getSelectorMap(
            visualizationType,
            this.currentScanResultState,
            this.currentAssessmentState,
        );
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
        visualizationType: VisualizationType,
        newVisualizationEnabledState: boolean,
        newSelectorMapState: DictionaryStringTo<AssessmentVisualizationInstance>,
        id: string,
    ): boolean {
        if (id in this.previousVisualizationStates === false && newVisualizationEnabledState === false) {
            this.previousVisualizationStates[id] = false;
        }
        return (
            id in this.previousVisualizationStates &&
            this.previousVisualizationStates[id] === newVisualizationEnabledState &&
            _.isEqual(this.previousVisualizationSelectorMapStates[visualizationType], newSelectorMapState)
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
