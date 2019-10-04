// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { VisualizationConfigurationFactory } from 'common/configs/visualization-configuration-factory';
import { VisualizationType } from 'common/types/visualization-type';
import { cloneDeep } from 'lodash';
import { DictionaryNumberTo, DictionaryStringTo } from 'types/common-types';

import { TargetPageStoreData } from './client-store-listener';
import { DrawingInitiator } from './drawing-initiator';
import { AssessmentVisualizationInstance } from './frameCommunicators/html-element-axe-results-helper';
import { IsVisualizationEnabledCallback } from './is-visualization-enabled';
import { SelectorMapHelper } from './selector-map-helper';
import { VisualizationNeedsUpdateCallback } from './visualization-needs-update';

export type VisualizationSelectorMapContainer = DictionaryNumberTo<DictionaryStringTo<AssessmentVisualizationInstance>>;
export type UpdateVisualization = (visualizationType: VisualizationType, step: string, storeData: TargetPageStoreData) => void;
export class TargetPageVisualizationUpdater {
    private previousVisualizationSelectorMapStates: VisualizationSelectorMapContainer = {};
    private previousVisualizationStates: DictionaryStringTo<boolean> = {};

    constructor(
        private visualizationConfigurationFactory: VisualizationConfigurationFactory,
        private selectorMapHelper: SelectorMapHelper,
        private drawingInitiator: DrawingInitiator,
        private getVisualizationState: IsVisualizationEnabledCallback,
        private visualizationNeedsToBeUpdated: VisualizationNeedsUpdateCallback,
    ) {}

    public updateVisualization: UpdateVisualization = (
        visualizationType: VisualizationType,
        step: string,
        storeData: TargetPageStoreData,
    ) => {
        const selectorMap = this.selectorMapHelper.getSelectorMap(visualizationType);
        this.executeUpdate(visualizationType, step, storeData, selectorMap);
        this.previousVisualizationSelectorMapStates[visualizationType] = selectorMap;
    };

    private executeUpdate = (
        visualizationType: VisualizationType,
        step: string,
        storeData: TargetPageStoreData,
        selectorMap: DictionaryStringTo<AssessmentVisualizationInstance>,
    ) => {
        const configuration = this.visualizationConfigurationFactory.getConfiguration(visualizationType);
        const id = configuration.getIdentifier(step);
        const newVisualizationEnabledState = this.getVisualizationState(
            configuration,
            step,
            storeData.visualizationStoreData,
            storeData.assessmentStoreData,
            storeData.tabStoreData,
        );

        if (this.visualizationNeedsToBeUpdated(visualizationType, id, newVisualizationEnabledState, selectorMap, null, null) === false) {
            return;
        }

        this.previousVisualizationStates[id] = newVisualizationEnabledState;

        if (newVisualizationEnabledState) {
            this.drawingInitiator.enableVisualization(
                visualizationType,
                storeData.featureFlagStoreData,
                cloneDeep(selectorMap),
                id,
                configuration.visualizationInstanceProcessor(step),
            );
        } else {
            this.drawingInitiator.disableVisualization(visualizationType, storeData.featureFlagStoreData, id);
        }
    };
}
