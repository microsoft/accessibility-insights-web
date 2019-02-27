// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IMock, It, Mock, Times } from 'typemoq';

import { DropdownActionMessageCreator } from '../../../../../common/message-creators/dropdown-action-message-creator';
import { Messages } from '../../../../../common/messages';
import { TelemetryDataFactory } from '../../../../../common/telemetry-data-factory';
import { TelemetryEventSource } from '../../../../../common/telemetry-events';
import { EventStubFactory } from './../../../common/event-stub-factory';

describe('DropdownActionMessageCreatorTest', () => {
    const eventStubFactory = new EventStubFactory();
    const testSource: TelemetryEventSource = -1 as TelemetryEventSource;
    let postMessageMock: IMock<(message) => {}>;
    let telemetryFactoryMock: IMock<TelemetryDataFactory>;
    let testObject: DropdownActionMessageCreator;
    const tabId: number = -1;
    let event: any;
    let telemetryData: any;

    beforeEach(() => {
        postMessageMock = Mock.ofInstance(message => {
            return null;
        });
        telemetryFactoryMock = Mock.ofType(TelemetryDataFactory);
        event = eventStubFactory.createMouseClickEvent() as any;
        telemetryData = {
            triggeredBy: 'mouseclick',
            source: testSource,
        };
        testObject = new DropdownActionMessageCreator(postMessageMock.object, tabId, telemetryFactoryMock.object);
    });

    test('openPreviewFeatures', () => {
        const expectedMessage = getExpectedMessage(Messages.PreviewFeatures.OpenPanel);

        setupTelemetryFactoryCall();
        setupPostMessage(expectedMessage);

        testObject.openPreviewFeaturesPanel(event, testSource);

        postMessageMock.verifyAll();
        telemetryFactoryMock.verifyAll();
    });

    test('openSettings', () => {
        const expectedMessage = getExpectedMessage(Messages.SettingsPanel.OpenPanel);

        setupTelemetryFactoryCall();
        setupPostMessage(expectedMessage);

        testObject.openSettingsPanel(event, testSource);

        postMessageMock.verifyAll();
        telemetryFactoryMock.verifyAll();
    });

    function getExpectedMessage(messageType: string) {
        return {
            tabId: tabId,
            type: messageType,
            payload: {
                telemetry: telemetryData,
            },
        };
    }

    function setupTelemetryFactoryCall() {
        telemetryFactoryMock
            .setup(tf => tf.withTriggeredByAndSource(event, testSource))
            .returns(() => telemetryData)
            .verifiable(Times.once());
    }

    function setupPostMessage(expectedMessage): void {
        postMessageMock.setup(post => post(It.isValue(expectedMessage))).verifiable(Times.once());
    }
});
