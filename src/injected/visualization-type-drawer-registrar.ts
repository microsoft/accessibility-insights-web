// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { RegisterDrawer } from 'injected/drawing-controller';
import { VisualizationConfigurationFactory } from '../common/configs/visualization-configuration-factory';
import { VisualizationType } from '../common/types/visualization-type';
import { DrawerProvider } from './visualization/drawer-provider';

export class VisualizationTypeDrawerRegistrar {
    constructor(
        private registerDrawer: RegisterDrawer,
        private visualizationConfigurationFactory: VisualizationConfigurationFactory,
        private assessmentProvider: AssessmentsProvider,
        private drawerProvider: DrawerProvider,
    ) {}

    public registerType = (visualizationType: VisualizationType) => {
        const config = this.visualizationConfigurationFactory.getConfiguration(visualizationType);
        if (this.assessmentProvider.isValidType(visualizationType)) {
            const steps = this.assessmentProvider.getStepMap(visualizationType);
            Object.keys(steps).forEach(key => {
                const step = steps[key];
                const id = config.getIdentifier(step.key);
                const drawer = config.getDrawer(this.drawerProvider, id);
                this.registerDrawer(id, drawer);
            });
        } else {
            const id = config.getIdentifier();
            const drawer = config.getDrawer(this.drawerProvider);
            this.registerDrawer(id, drawer);
        }
    };
}
