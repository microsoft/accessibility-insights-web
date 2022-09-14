// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { VisualizationConfiguration } from 'common/configs/visualization-configuration';
import { VisualizationConfigurationFactory } from 'common/configs/visualization-configuration-factory';
import { VisualizationType } from 'common/types/visualization-type';
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
    [visualizationType: number]: {
        [testStepConfigId: string]: TestStepVisualizationState;
    };
};

export type UpdateVisualization = (
    visualizationType: VisualizationType,
    step: string,
    storeData: TargetPageStoreData,
) => Promise<void>;

export type IsVisualizationNewlyEnabledCallback = (
    oldState: TestStepVisualizationState | undefined,
    newState: TestStepVisualizationState,
) => boolean;

const isVisualizationNewlyEnabled: IsVisualizationNewlyEnabledCallback = (newState, oldState) =>
    newState.enabled && oldState?.enabled;

export class TargetPageVisualizationUpdater {
    private previousVisualizationStates: TestStepVisualizationStateMap = {};

    constructor(
        private visualizationConfigurationFactory: VisualizationConfigurationFactory,
        private selectorMapHelper: SelectorMapHelper,
        private drawingInitiator: DrawingInitiator,
        private isVisualizationEnabled: IsVisualizationEnabledCallback,
        private visualizationNeedsUpdate: VisualizationNeedsUpdateCallback,
        private isNewlyEnabled: IsVisualizationNewlyEnabledCallback = isVisualizationNewlyEnabled,
    ) {}

    public updateVisualization: UpdateVisualization = async (
        visualizationType: VisualizationType,
        stepKey: string,
        storeData: TargetPageStoreData,
    ) => {
        const configuration =
            this.visualizationConfigurationFactory.getConfiguration(visualizationType);
        const configId = configuration.getIdentifier(stepKey);

        const oldState = this.previousVisualizationStates[visualizationType]?.[configId];
        const newState = this.calculateVisualizationState(
            visualizationType,
            configuration,
            stepKey,
            storeData,
        );
        const newlyEnabled = this.isNewlyEnabled(newState, oldState);

        if (!this.visualizationNeedsUpdate(newState, oldState)) {
            return;
        }

        this.updatePreviousVisualizationState(visualizationType, configId, newState);

        if (newState.enabled) {
            if (newlyEnabled) {
                await this.drawingInitiator.enableVisualization(
                    visualizationType,
                    storeData.featureFlagStoreData,
                    cloneDeep(newState.selectorMap),
                    configId,
                    configuration.visualizationInstanceProcessor(stepKey),
                );
            } else {
                await this.drawingInitiator.updateVisualization(
                    visualizationType,
                    storeData.featureFlagStoreData,
                    cloneDeep(newState.selectorMap),
                    configId,
                    configuration.visualizationInstanceProcessor(stepKey),
                );
            }
        } else {
            await this.drawingInitiator.disableVisualization(
                visualizationType,
                storeData.featureFlagStoreData,
                configId,
            );
        }
    };

    private updatePreviousVisualizationState(
        visualizationType: VisualizationType,
        configId: string,
        newState: TestStepVisualizationState,
    ) {
        if (this.previousVisualizationStates[visualizationType] === undefined) {
            this.previousVisualizationStates[visualizationType] = {};
        }
        this.previousVisualizationStates[visualizationType][configId] = newState;
    }

    private calculateVisualizationState(
        visualizationType: VisualizationType,
        configuration: VisualizationConfiguration,
        stepKey: string,
        storeData: TargetPageStoreData,
    ): TestStepVisualizationState {
        const enabled = this.isVisualizationEnabled(
            configuration,
            stepKey,
            storeData.visualizationStoreData,
            storeData.assessmentStoreData,
            storeData.tabStoreData,
        );
        const selectorMap = this.selectorMapHelper.getSelectorMap(
            visualizationType,
            stepKey,
            storeData,
        );
        return {
            enabled,
            selectorMap,
        };
    }
}
