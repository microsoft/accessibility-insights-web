// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ActionMessageDispatcher } from 'common/message-creators/types/dispatcher';
import { InspectMode } from 'common/types/store-data/inspect-modes';
import { IMock, Mock, MockBehavior, Times } from 'typemoq';

import {
    BaseTelemetryData,
    TelemetryEventSource,
} from '../../../../../common/extension-telemetry-events';
import { Message } from '../../../../../common/message';
import { InspectActionMessageCreator } from '../../../../../common/message-creators/inspect-action-message-creator';
import { Messages } from '../../../../../common/messages';
import { TelemetryDataFactory } from '../../../../../common/telemetry-data-factory';
import { EventStubFactory } from './../../../common/event-stub-factory';

describe('InspectActionMessageCreatorTest', () => {
    const eventStubFactory = new EventStubFactory();
    const testSource: TelemetryEventSource = -1 as TelemetryEventSource;
    const dispatcherMock = Mock.ofType<ActionMessageDispatcher>();
    let telemetryFactoryMock: IMock<TelemetryDataFactory>;
    let testSubject: InspectActionMessageCreator;

    beforeEach(() => {
        dispatcherMock.reset();
        telemetryFactoryMock = Mock.ofType(TelemetryDataFactory, MockBehavior.Strict);
        testSubject = new InspectActionMessageCreator(
            telemetryFactoryMock.object,
            testSource,
            dispatcherMock.object,
        );
    });

    it('dispatches message for changeMode', () => {
        const event = eventStubFactory.createMouseClickEvent() as any;
        const telemetry: BaseTelemetryData = {
            triggeredBy: 'mouseclick',
            source: testSource,
        };

        const inspectMode = InspectMode.scopingAddInclude;

        const expectedMessage: Message = {
            messageType: Messages.Inspect.ChangeInspectMode,
            payload: {
                inspectMode,
                telemetry,
            },
        };

        telemetryFactoryMock
            .setup(tf => tf.withTriggeredByAndSource(event, testSource))
            .returns(() => telemetry)
            .verifiable(Times.once());

        testSubject.changeInspectMode(event, inspectMode);
        telemetryFactoryMock.verifyAll();
        dispatcherMock.verify(
            dispatcher => dispatcher.dispatchMessage(expectedMessage),
            Times.once(),
        );
    });
});
