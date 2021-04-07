// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { VisualizationConfiguration } from 'common/configs/visualization-configuration';
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

export type VisualizationSelectorMapContainer = DictionaryNumberTo<
    DictionaryStringTo<AssessmentVisualizationInstance>
>;
export type UpdateVisualization = (
    visualizationType: VisualizationType,
    step: string,
    storeData: TargetPageStoreData,
) => void;
export class TargetPageVisualizationUpdater {
    private previousVisualizationSelectorMapStates: VisualizationSelectorMapContainer = {};
    private previousVisualizationStates: DictionaryStringTo<boolean> = {};

    constructor(
        private visualizationConfigurationFactory: VisualizationConfigurationFactory,
        private selectorMapHelper: SelectorMapHelper,
        private drawingInitiator: DrawingInitiator,
        private isVisualizationEnabled: IsVisualizationEnabledCallback,
        private visualizationNeedsUpdate: VisualizationNeedsUpdateCallback,
    ) {}

    public updateVisualization: UpdateVisualization = (
        visualizationType: VisualizationType,
        stepKey: string,
        storeData: TargetPageStoreData,
    ) => {
        const selectorMap = this.selectorMapHelper.getSelectorMap(
            visualizationType,
            stepKey,
            storeData,
        );
        const configuration = this.visualizationConfigurationFactory.getConfiguration(
            visualizationType,
        );
        const configId = configuration.getIdentifier(stepKey);
        this.executeUpdate(
            visualizationType,
            stepKey,
            storeData,
            selectorMap,
            configuration,
            configId,
        );
        this.previousVisualizationSelectorMapStates[visualizationType] = selectorMap;
    };

    private executeUpdate = (
        visualizationType: VisualizationType,
        stepKey: string,
        storeData: TargetPageStoreData,
        selectorMap: DictionaryStringTo<AssessmentVisualizationInstance>,
        configuration: VisualizationConfiguration,
        configId: string,
    ) => {
        const newVisualizationEnabledState = this.isVisualizationEnabled(
            configuration,
            stepKey,
            storeData.visualizationStoreData,
            storeData.assessmentStoreData,
            storeData.tabStoreData,
        );

        if (
            this.visualizationNeedsUpdate(
                visualizationType,
                configId,
                newVisualizationEnabledState,
                selectorMap,
                this.previousVisualizationStates,
                this.previousVisualizationSelectorMapStates,
            ) === false
        ) {
            return;
        }

        this.previousVisualizationStates[configId] = newVisualizationEnabledState;

        if (newVisualizationEnabledState) {
            this.drawingInitiator.enableVisualization(
                visualizationType,
                storeData.featureFlagStoreData,
                cloneDeep(selectorMap),
                configId,
                configuration.visualizationInstanceProcessor(stepKey),
            );
        } else {
            this.drawingInitiator.disableVisualization(
                visualizationType,
                storeData.featureFlagStoreData,
                configId,
            );
        }
    };
}
