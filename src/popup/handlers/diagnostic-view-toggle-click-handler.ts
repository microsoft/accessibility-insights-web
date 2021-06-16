// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import { VisualizationConfigurationFactory } from '../../common/configs/visualization-configuration-factory';
import { TelemetryEventSource } from '../../common/extension-telemetry-events';
import { VisualizationActionMessageCreator } from '../../common/message-creators/visualization-action-message-creator';
import { TelemetryDataFactory } from '../../common/telemetry-data-factory';
import { VisualizationStoreData } from '../../common/types/store-data/visualization-store-data';
import { VisualizationType } from '../../common/types/visualization-type';

export class DiagnosticViewClickHandler {
    private telemetryFactory: TelemetryDataFactory;
    private visualizationActionCreator: VisualizationActionMessageCreator;
    private visualizationConfigurationFactory: VisualizationConfigurationFactory;

    constructor(
        telemetryFactory: TelemetryDataFactory,
        visualizationActionCreator: VisualizationActionMessageCreator,
        visualizationConfigurationFactory: VisualizationConfigurationFactory,
    ) {
        this.telemetryFactory = telemetryFactory;
        this.visualizationConfigurationFactory = visualizationConfigurationFactory;
        this.visualizationActionCreator = visualizationActionCreator;
    }

    public toggleVisualization(
        visualizationStoreData: VisualizationStoreData,
        visualizationType: VisualizationType,
        event: React.MouseEvent<HTMLElement>,
    ): void {
        const configuration =
            this.visualizationConfigurationFactory.getConfiguration(visualizationType);
        const scanData = configuration.getStoreData(visualizationStoreData.tests);
        const newValue = !scanData.enabled;
        const source = TelemetryEventSource.AdHocTools;

        const telemetryInfo = this.telemetryFactory.forToggle(event, newValue, source);
        this.visualizationActionCreator.setVisualizationState(
            visualizationType,
            newValue,
            telemetryInfo,
        );
    }
}
