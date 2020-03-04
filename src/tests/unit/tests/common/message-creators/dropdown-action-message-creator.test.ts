// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ActionMessageDispatcher } from 'common/message-creators/types/dispatcher';
import { IMock, Mock, Times } from 'typemoq';

import {
    SettingsOpenSourceItem,
    TelemetryEventSource,
} from '../../../../../common/extension-telemetry-events';
import { Message } from '../../../../../common/message';
import { DropdownActionMessageCreator } from '../../../../../common/message-creators/dropdown-action-message-creator';
import { Messages } from '../../../../../common/messages';
import { TelemetryDataFactory } from '../../../../../common/telemetry-data-factory';
import { EventStubFactory } from './../../../common/event-stub-factory';

describe('DropdownActionMessageCreatorTest', () => {
    const eventStubFactory = new EventStubFactory();
    const testSource: TelemetryEventSource = -1 as TelemetryEventSource;
    let telemetryFactoryMock: IMock<TelemetryDataFactory>;
    const dispatcherMock = Mock.ofType<ActionMessageDispatcher>();
    let event: any;
    let telemetryData: any;

    let testObject: DropdownActionMessageCreator;

    beforeEach(() => {
        dispatcherMock.reset();
        telemetryFactoryMock = Mock.ofType(TelemetryDataFactory);
        event = eventStubFactory.createMouseClickEvent() as any;
        telemetryData = {
            triggeredBy: 'mouseclick',
            source: testSource,
        };
        testObject = new DropdownActionMessageCreator(
            telemetryFactoryMock.object,
            dispatcherMock.object,
        );
    });

    it('dispatches message for openPreviewFeaturesPanel', () => {
        const expectedMessage = getExpectedMessage(Messages.PreviewFeatures.OpenPanel);

        setupTelemetryFactoryWithTriggeredByAndSourceCall();

        testObject.openPreviewFeaturesPanel(event, testSource);

        dispatcherMock.verify(
            dispatcher => dispatcher.dispatchMessage(expectedMessage),
            Times.once(),
        );
    });

    it('dispatches message for openScopingPanel', () => {
        const expectedMessage = getExpectedMessage(Messages.Scoping.OpenPanel);

        setupTelemetryFactoryWithTriggeredByAndSourceCall();

        testObject.openScopingPanel(event, testSource);

        dispatcherMock.verify(
            dispatcher => dispatcher.dispatchMessage(expectedMessage),
            Times.once(),
        );
    });

    it('dispatches message for openSettingsPanel', () => {
        const expectedMessage = getExpectedMessage(Messages.SettingsPanel.OpenPanel);
        const sourceItem: SettingsOpenSourceItem = 'menu';
        expectedMessage.payload.telemetry.sourceItem = sourceItem;

        setupTelemetryFactoryForSettingsPanelOpenCall(sourceItem);

        testObject.openSettingsPanel(event, testSource);

        dispatcherMock.verify(
            dispatcher => dispatcher.dispatchMessage(expectedMessage),
            Times.once(),
        );
    });

    it('dispatches message for openDebugTools', () => {
        testObject.openDebugTools();

        dispatcherMock.verify(
            dispatcher => dispatcher.dispatchType(Messages.DebugTools.Open),
            Times.once(),
        );
    });

    function getExpectedMessage(messageType: string): Message {
        return {
            messageType: messageType,
            payload: {
                telemetry: telemetryData,
            },
        };
    }

    function setupTelemetryFactoryWithTriggeredByAndSourceCall(): void {
        telemetryFactoryMock
            .setup(tf => tf.withTriggeredByAndSource(event, testSource))
            .returns(() => telemetryData);
    }

    function setupTelemetryFactoryForSettingsPanelOpenCall(
        sourceItem: SettingsOpenSourceItem,
    ): void {
        telemetryFactoryMock
            .setup(tf => tf.forSettingsPanelOpen(event, testSource, sourceItem))
            .returns(() => telemetryData)
            .verifiable(Times.once());
    }
});
