// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Requirement } from 'assessments/types/requirement';
import { VisualizationConfiguration } from 'common/configs/visualization-configuration';
import {
    ForEachConfigCallback,
    VisualizationConfigurationFactory,
} from '../common/configs/visualization-configuration-factory';
import { VisualizationType } from '../common/types/visualization-type';
import { Drawer } from './visualization/drawer';
import { DrawerProvider } from './visualization/drawer-provider';

export type RegisterDrawer = (id: string, drawer: Drawer) => void;

export class VisualizationTypeDrawerRegistrar {
    constructor(
        private registerDrawer: RegisterDrawer,
        private visualizationConfigurationFactory: VisualizationConfigurationFactory,
        private drawerProvider: DrawerProvider,
    ) {}

    public registerAllVisualizations = () => {
        this.visualizationConfigurationFactory.forEachConfig(
            this.registerVisualizationConfiguration,
        );
    };

    private registerVisualizationConfiguration: ForEachConfigCallback = (
        config: VisualizationConfiguration,
        type: VisualizationType,
        requirementConfig?: Requirement,
    ) => {
        const id = config.getIdentifier(requirementConfig?.key);
        const drawer = config.getDrawer(this.drawerProvider, requirementConfig?.key);
        this.registerDrawer(id, drawer);
    };
}
