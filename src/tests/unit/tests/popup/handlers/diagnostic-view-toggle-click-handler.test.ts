// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { WebVisualizationConfigurationFactory } from 'common/configs/web-visualization-configuration-factory';
import { It, Mock } from 'typemoq';

import {
    TelemetryEventSource,
    ToggleTelemetryData,
} from '../../../../../common/extension-telemetry-events';
import { VisualizationActionMessageCreator } from '../../../../../common/message-creators/visualization-action-message-creator';
import { TelemetryDataFactory } from '../../../../../common/telemetry-data-factory';
import { VisualizationType } from '../../../../../common/types/visualization-type';
import { DiagnosticViewClickHandler } from '../../../../../popup/handlers/diagnostic-view-toggle-click-handler';
import { EventStubFactory } from '../../../common/event-stub-factory';
import { VisualizationStoreDataBuilder } from '../../../common/visualization-store-data-builder';

describe('DiagnosticViewToggleClickHandlerTest', () => {
    const eventStubFactory = new EventStubFactory();

    test('toggleVisualization to enabled', () => {
        const event = eventStubFactory.createKeypressEvent() as any;
        const source = TelemetryEventSource.AdHocTools;

        const expectedTelemetryInfo: ToggleTelemetryData = {
            triggeredBy: 'keypress',
            enabled: true,
            source,
        };

        const visualizationStoreData = new VisualizationStoreDataBuilder().build();

        const visualizationType = VisualizationType.Headings;

        const visualizationActionCreatorMock = Mock.ofType(VisualizationActionMessageCreator);

        visualizationActionCreatorMock
            .setup(ac =>
                ac.setVisualizationState(
                    visualizationType,
                    true,
                    It.isValue(expectedTelemetryInfo),
                ),
            )
            .verifiable();

        const telemetryFactoryMock = Mock.ofType(TelemetryDataFactory);
        telemetryFactoryMock
            .setup(tf => tf.forToggle(event, true, source))
            .returns(() => expectedTelemetryInfo)
            .verifiable();

        const testObject = new DiagnosticViewClickHandler(
            telemetryFactoryMock.object,
            visualizationActionCreatorMock.object,
            new WebVisualizationConfigurationFactory(),
        );
        testObject.toggleVisualization(visualizationStoreData, visualizationType, event);

        visualizationActionCreatorMock.verifyAll();
        telemetryFactoryMock.verifyAll();
    });

    test('toggleVisualization to disabled', () => {
        const event = eventStubFactory.createKeypressEvent() as any;
        const source = TelemetryEventSource.AdHocTools;

        const expectedTelemetryInfo: ToggleTelemetryData = {
            triggeredBy: 'keypress',
            enabled: false,
            source,
        };

        const visualizationType = VisualizationType.Headings;

        const visualizationStoreData = new VisualizationStoreDataBuilder()
            .withEnable(visualizationType)
            .build();

        const visualizationActionCreatorMock = Mock.ofType(VisualizationActionMessageCreator);

        visualizationActionCreatorMock
            .setup(ac =>
                ac.setVisualizationState(
                    visualizationType,
                    false,
                    It.isValue(expectedTelemetryInfo),
                ),
            )
            .verifiable();

        const telemetryFactoryMock = Mock.ofType(TelemetryDataFactory);
        telemetryFactoryMock
            .setup(tf => tf.forToggle(event, false, source))
            .returns(() => expectedTelemetryInfo)
            .verifiable();

        const testObject = new DiagnosticViewClickHandler(
            telemetryFactoryMock.object,
            visualizationActionCreatorMock.object,
            new WebVisualizationConfigurationFactory(),
        );
        testObject.toggleVisualization(visualizationStoreData, visualizationType, event);

        visualizationActionCreatorMock.verifyAll();
        telemetryFactoryMock.verifyAll();
    });
});
