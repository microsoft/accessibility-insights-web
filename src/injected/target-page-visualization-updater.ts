// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { VisualizationConfiguration } from 'common/configs/visualization-configuration';
import { VisualizationConfigurationFactory } from 'common/configs/visualization-configuration-factory';
import { VisualizationType } from 'common/types/visualization-type';
import { SelectorToVisualizationMap } from 'injected/selector-to-visualization-map';
import { cloneDeep } from 'lodash';

import { TargetPageStoreData } from './client-store-listener';
import { DrawingInitiator } from './drawing-initiator';
import { IsVisualizationEnabledCallback } from './is-visualization-enabled';
import { SelectorMapHelper } from './selector-map-helper';
import {
    TestStepVisualizationState,
    VisualizationNeedsUpdateCallback,
} from './visualization-needs-update';

type TestStepVisualizationStateMap = {
    // assessment-style-cop.test.ts ensures the assumption this type is making that these IDs are
    // never repeated between different tests' steps.
    [testStepConfigId: string]: TestStepVisualizationState;
};

export type UpdateVisualization = (
    visualizationType: VisualizationType,
    step: string,
    storeData: TargetPageStoreData,
) => void;
export class TargetPageVisualizationUpdater {
    private previousVisualizationStates: TestStepVisualizationStateMap = {};

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
    };

    private executeUpdate = (
        visualizationType: VisualizationType,
        stepKey: string,
        storeData: TargetPageStoreData,
        selectorMap: SelectorToVisualizationMap,
        configuration: VisualizationConfiguration,
        configId: string,
    ) => {
        const visualizationShouldBeEnabled = this.isVisualizationEnabled(
            configuration,
            stepKey,
            storeData.visualizationStoreData,
            storeData.assessmentStoreData,
            storeData.tabStoreData,
        );

        const oldVisualizationState = this.previousVisualizationStates[configId];
        const newVisualizationState = {
            enabled: visualizationShouldBeEnabled,
            selectorMap,
        };

        if (!this.visualizationNeedsUpdate(newVisualizationState, oldVisualizationState)) {
            return;
        }

        this.previousVisualizationStates[configId] = newVisualizationState;

        if (visualizationShouldBeEnabled) {
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
