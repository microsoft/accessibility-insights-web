// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { map } from 'lodash';
import * as React from 'react';

import { TestMode } from '../../../common/configs/test-mode';
import { VisualizationConfigurationFactory } from '../../../common/configs/visualization-configuration-factory';
import { IBaseStore } from '../../../common/istore';
import { TelemetryEventSource } from '../../../common/telemetry-events';
import { FeatureFlagStoreData } from '../../../common/types/store-data/feature-flag-store-data';
import { ICommandStoreData } from '../../../common/types/store-data/icommand-store-data';
import { IVisualizationStoreData } from '../../../common/types/store-data/ivisualization-store-data';
import { VisualizationType } from '../../../common/types/visualization-type';
import { PopupActionMessageCreator } from '../actions/popup-action-message-creator';
import { DiagnosticViewClickHandler } from '../handlers/diagnostic-view-toggle-click-handler';
import { DiagnosticViewToggle, DiagnosticViewToggleDeps } from './diagnostic-view-toggle';

export class DiagnosticViewToggleFactory {
    private visualizationTypes: VisualizationType[];
    private visualizationConfigurationFactory: VisualizationConfigurationFactory;
    private visualizationStore: IBaseStore<IVisualizationStoreData>;
    private featureFlagsStore: IBaseStore<FeatureFlagStoreData>;
    private commandStore: IBaseStore<ICommandStoreData>;
    private actionMessageCreator: PopupActionMessageCreator;
    private clickHandler: DiagnosticViewClickHandler;
    private dom: NodeSelector & Node;

    constructor(
        private readonly deps: DiagnosticViewToggleDeps,
        dom: NodeSelector & Node,
        visualizationTypes: VisualizationType[],
        visualizationConfigurationFactory: VisualizationConfigurationFactory,
        visualizationStore: IBaseStore<IVisualizationStoreData>,
        featureFlagStore: IBaseStore<FeatureFlagStoreData>,
        commandStore: IBaseStore<ICommandStoreData>,
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

    public createTogglesForLaunchPanel(): JSX.Element[] {
        const sorting = (typeA, typeB) => {
            const configA = this.visualizationConfigurationFactory.getConfiguration(typeA);
            const configB = this.visualizationConfigurationFactory.getConfiguration(typeB);

            return configA.launchPanelDisplayOrder - configB.launchPanelDisplayOrder;
        };

        const source = TelemetryEventSource.OldLaunchPanel;

        return this.createToggles(sorting, source);
    }

    public createTogglesForAdhocToolsPanel(): JSX.Element[] {
        const sorting = (typeA, typeB) => {
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

        const toggles: JSX.Element[] = map(enabledTypes, type => {
            return (
                <DiagnosticViewToggle
                    deps={this.deps}
                    featureFlags={this.featureFlagsStore.getState()}
                    dom={this.dom}
                    type={type}
                    key={this.getToggleKey(type)}
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

        const enabledTypes: VisualizationType[] = this.visualizationTypes.filter(type => {
            const config = this.visualizationConfigurationFactory.getConfiguration(type);
            if (config.testMode !== TestMode.Adhoc) {
                return false;
            }

            if (config.featureFlagToEnable == null) {
                return true;
            }

            return featureFlags[config.featureFlagToEnable];
        });

        return enabledTypes;
    }

    private getToggleKey(type: VisualizationType): string {
        return `diagnostic_view_toggle_${type}`;
    }
}
