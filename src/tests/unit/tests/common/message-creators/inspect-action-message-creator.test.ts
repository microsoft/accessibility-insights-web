// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';

import { InspectMode } from '../../../../../background/inspect-modes';
import { InspectActionMessageCreator } from '../../../../../common/message-creators/inspect-action-message-creator';
import { Messages } from '../../../../../common/messages';
import { TelemetryDataFactory } from '../../../../../common/telemetry-data-factory';
import { TelemetryEventSource } from '../../../../../common/telemetry-events';
import { EventStubFactory } from './../../../common/event-stub-factory';

describe('InspectActionMessageCreatorTest', () => {
    const eventStubFactory = new EventStubFactory();
    const testSource: TelemetryEventSource = -1 as TelemetryEventSource;
    let postMessageMock: IMock<(message) => {}>;
    let telemetryFactoryMock: IMock<TelemetryDataFactory>;
    let testSubject: InspectActionMessageCreator;
    const tabId: number = -1;

    beforeEach(() => {
        postMessageMock = Mock.ofInstance(message => {
            return null;
        });
        telemetryFactoryMock = Mock.ofType(TelemetryDataFactory, MockBehavior.Strict);
        testSubject = new InspectActionMessageCreator(postMessageMock.object, tabId, telemetryFactoryMock.object, testSource);
    });

    test('changeMode', () => {
        const event = eventStubFactory.createMouseClickEvent() as any;
        const telemetry = {
            triggeredBy: 'mouseclick',
            source: testSource,
        };

        const inspectMode = InspectMode.scopingAddInclude;

        const expectedMessage = {
            tabId: tabId,
            type: Messages.Inspect.ChangeInspectMode,
            payload: {
                inspectMode,
                telemetry,
            },
        };

        telemetryFactoryMock
            .setup(tf => tf.withTriggeredByAndSource(event, testSource))
            .returns(() => telemetry)
            .verifiable(Times.once());

        setupPostMessage(expectedMessage);
        testSubject.changeInspectMode(event, inspectMode);
        postMessageMock.verifyAll();
        telemetryFactoryMock.verifyAll();
    });

    function setupPostMessage(expectedMessage): void {
        postMessageMock.setup(post => post(It.isValue(expectedMessage))).verifiable(Times.once());
    }
});
