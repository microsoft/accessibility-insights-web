// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentsProvider } from '../assessments/types/assessments-provider';
import { VisualizationConfigurationFactory } from '../common/configs/visualization-configuration-factory';
import { VisualizationType } from '../common/types/visualization-type';
import { Drawer } from './visualization/drawer';
import { DrawerProvider } from './visualization/drawer-provider';

export type RegisterDrawer = (id: string, drawer: Drawer) => void;

export class VisualizationTypeDrawerRegistrator {
    constructor(
        private registerDrawer: RegisterDrawer,
        private visualizationConfigurationFactory: VisualizationConfigurationFactory,
        private assessmentProvider: AssessmentsProvider,
        private drawerProvider: DrawerProvider,
    ) {}

    public registerType(visualizationType: VisualizationType): void {
        const config = this.visualizationConfigurationFactory.getConfiguration(visualizationType);
        let id: string;
        let drawer: Drawer;
        if (this.assessmentProvider.isValidType(visualizationType)) {
            const steps = this.assessmentProvider.getStepMap(visualizationType);
            Object.keys(steps).forEach(key => {
                const step = steps[key];
                id = config.getIdentifier(step.key);
                drawer = config.getDrawer(this.drawerProvider, id);
            });
        } else {
            id = config.getIdentifier();
            drawer = config.getDrawer(this.drawerProvider);
        }

        this.registerDrawer(id, drawer);
    }
}
