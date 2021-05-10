// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BaseStore } from 'common/base-store';
import { TestMode } from 'common/configs/test-mode';
import { VisualizationConfigurationFactory } from 'common/configs/visualization-configuration-factory';
import { TelemetryEventSource } from 'common/extension-telemetry-events';
import { CommandStoreData } from 'common/types/store-data/command-store-data';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { VisualizationStoreData } from 'common/types/store-data/visualization-store-data';
import { VisualizationType } from 'common/types/visualization-type';
import { map } from 'lodash';
import * as React from 'react';
import { PopupActionMessageCreator } from '../actions/popup-action-message-creator';
import { DiagnosticViewClickHandler } from '../handlers/diagnostic-view-toggle-click-handler';
import { DiagnosticViewToggle, DiagnosticViewToggleDeps } from './diagnostic-view-toggle';

export class DiagnosticViewToggleFactory {
    private visualizationTypes: VisualizationType[];
    private visualizationConfigurationFactory: VisualizationConfigurationFactory;
    private visualizationStore: BaseStore<VisualizationStoreData>;
    private featureFlagsStore: BaseStore<FeatureFlagStoreData>;
    private commandStore: BaseStore<CommandStoreData>;
    private actionMessageCreator: PopupActionMessageCreator;
    private clickHandler: DiagnosticViewClickHandler;
    private dom: Document;

    constructor(
        private readonly deps: DiagnosticViewToggleDeps,
        dom: Document,
        visualizationTypes: VisualizationType[],
        visualizationConfigurationFactory: VisualizationConfigurationFactory,
        visualizationStore: BaseStore<VisualizationStoreData>,
        featureFlagStore: BaseStore<FeatureFlagStoreData>,
        commandStore: BaseStore<CommandStoreData>,
        actionMessageCreator: PopupActionMessageCreator,
        clickHandler: DiagnosticViewClickHandler,
    ) {
        this.dom = dom;
        this.visualizationTypes = visualizationTypes;
        this.visualizationConfigurationFactory = visualizationConfigurationFactory;
        this.visualizationStore = visualizationStore;
        this.featureFlagsStore = featureFlagStore;
        this.commandStore = commandStore;
        this.actionMessageCreator = actionMessageCreator;
        this.clickHandler = clickHandler;
    }

    public createTogglesForAdHocToolsPanel(): JSX.Element[] {
        const sorting = (typeA: VisualizationType, typeB: VisualizationType) => {
            const configA = this.visualizationConfigurationFactory.getConfiguration(typeA);
            const configB = this.visualizationConfigurationFactory.getConfiguration(typeB);

            return configA.adhocToolsPanelDisplayOrder - configB.adhocToolsPanelDisplayOrder;
        };

        const source = TelemetryEventSource.AdHocTools;

        return this.createToggles(sorting, source);
    }

    private createToggles(
        sortingFunction: (typeA: VisualizationType, typeB: VisualizationType) => number,
        telemetrySource: TelemetryEventSource,
    ): JSX.Element[] {
        const enabledTypes: VisualizationType[] = this.getEnabledTypes();
        enabledTypes.sort(sortingFunction);

        const visualizationStoreData = this.visualizationStore.getState();
        const commandStoreData = this.commandStore.getState();

        const toggles: JSX.Element[] = map(enabledTypes, visualizationType => {
            return (
                <DiagnosticViewToggle
                    deps={this.deps}
                    featureFlags={this.featureFlagsStore.getState()}
                    dom={this.dom}
                    visualizationType={visualizationType}
                    key={this.getToggleKey(visualizationType)}
                    shortcutCommands={commandStoreData.commands}
                    visualizationConfigurationFactory={this.visualizationConfigurationFactory}
                    actionMessageCreator={this.actionMessageCreator}
                    clickHandler={this.clickHandler}
                    visualizationStoreData={visualizationStoreData}
                    telemetrySource={telemetrySource}
                />
            );
        });

        return toggles;
    }

    private getEnabledTypes(): VisualizationType[] {
        const featureFlags = this.featureFlagsStore.getState();

        const enabledTypes: VisualizationType[] = this.visualizationTypes.filter(
            visualizationType => {
                const config =
                    this.visualizationConfigurationFactory.getConfiguration(visualizationType);
                if (config.testMode !== TestMode.Adhoc) {
                    return false;
                }

                if (config.featureFlagToEnable == null) {
                    return true;
                }

                return featureFlags[config.featureFlagToEnable];
            },
        );

        return enabledTypes;
    }

    private getToggleKey(visualizationType: VisualizationType): string {
        return `diagnostic_view_toggle_${visualizationType}`;
    }
}
