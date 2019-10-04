// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { isEqual } from 'lodash';

import { AssessmentsProvider } from '../assessments/types/assessments-provider';
import { TestMode } from '../common/configs/test-mode';
import { VisualizationConfiguration } from '../common/configs/visualization-configuration';
import { VisualizationConfigurationFactory } from '../common/configs/visualization-configuration-factory';
import { AssessmentStoreData } from '../common/types/store-data/assessment-result-data';
import { TabStoreData } from '../common/types/store-data/tab-store-data';
import { AssessmentScanData, VisualizationStoreData } from '../common/types/store-data/visualization-store-data';
import { VisualizationType } from '../common/types/visualization-type';
import { DictionaryNumberTo, DictionaryStringTo } from '../types/common-types';
import { TargetPageStoreData } from './client-store-listener';
import { DrawingInitiator } from './drawing-initiator';
import { AssessmentVisualizationInstance } from './frameCommunicators/html-element-axe-results-helper';
import { SelectorMapHelper } from './selector-map-helper';

export class VisualizationStateChangeHandler {
    private previousVisualizationSelectorMapStates: DictionaryNumberTo<DictionaryStringTo<AssessmentVisualizationInstance>> = {};
    protected previousVisualizationStates: DictionaryStringTo<boolean> = {};

    constructor(
        private visualizations: VisualizationType[],
        private visualizationConfigurationFactory: VisualizationConfigurationFactory,
        private selectorMapHelper: SelectorMapHelper,
        private drawingInitiator: DrawingInitiator,
        private assessmentProvider: AssessmentsProvider,
    ) {}

    public executeUpdates(storeData: TargetPageStoreData): void {
        this.visualizations.forEach(visualizationType => {
            const configuration = this.visualizationConfigurationFactory.getConfiguration(visualizationType);

            if (this.assessmentProvider.isValidType(visualizationType)) {
                const stepMap = this.assessmentProvider.getStepMap(visualizationType);
                Object.values(stepMap).forEach(step => {
                    this.executeUpdate(visualizationType, step.name, configuration, storeData);
                });
            } else {
                this.executeUpdate(visualizationType, null, configuration, storeData);
            }
            const selectorMap = this.selectorMapHelper.getSelectorMap(visualizationType);
            this.previousVisualizationSelectorMapStates[visualizationType] = selectorMap;
        });
    }

    private executeUpdate(
        visualizationType: VisualizationType,
        step: string,
        configuration: VisualizationConfiguration,
        storeData: TargetPageStoreData,
    ): void {
        const selectorMap = this.selectorMapHelper.getSelectorMap(visualizationType);
        const id = configuration.getIdentifier(step);
        const newVisualizationEnabledState = this.isVisualizationEnabled(
            configuration,
            storeData.visualizationStoreData,
            storeData.assessmentStoreData,
            storeData.tabStoreData,
            step,
        );

        if (this.isVisualizationStateUnchanged(visualizationType, newVisualizationEnabledState, selectorMap, id)) {
            return;
        }

        this.previousVisualizationStates[id] = newVisualizationEnabledState;

        if (newVisualizationEnabledState) {
            this.drawingInitiator.enableVisualization(
                visualizationType,
                storeData.featureFlagStoreData,
                selectorMap,
                id,
                configuration.visualizationInstanceProcessor(step),
            );
        } else {
            this.drawingInitiator.disableVisualization(visualizationType, storeData.featureFlagStoreData, id);
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
            isEqual(this.previousVisualizationSelectorMapStates[visualizationType], newSelectorMapState)
        );
    }

    private isVisualizationEnabled(
        config: VisualizationConfiguration,
        visualizationState: VisualizationStoreData,
        assessmentState: AssessmentStoreData,
        tabState: TabStoreData,
        step: string,
    ): boolean {
        const scanData = config.getStoreData(visualizationState.tests);
        return (
            config.getTestStatus(scanData, step) &&
            (!this.isAssessment(config) || assessmentState.persistedTabInfo === null || tabState.id === assessmentState.persistedTabInfo.id)
        );
    }

    private isAssessment(config: VisualizationConfiguration): boolean {
        return config.testMode === TestMode.Assessments;
    }
}
