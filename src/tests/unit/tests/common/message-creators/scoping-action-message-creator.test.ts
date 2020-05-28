// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ActionMessageDispatcher } from 'common/message-creators/types/dispatcher';
import { IMock, Mock, MockBehavior, Times } from 'typemoq';

import {
    ScopingTelemetryData,
    TelemetryEventSource,
} from '../../../../../common/extension-telemetry-events';
import { Message } from '../../../../../common/message';
import { ScopingActionMessageCreator } from '../../../../../common/message-creators/scoping-action-message-creator';
import { Messages } from '../../../../../common/messages';
import { TelemetryDataFactory } from '../../../../../common/telemetry-data-factory';
import { EventStubFactory } from './../../../common/event-stub-factory';

describe('ScopingActionMessageCreatorTest', () => {
    const eventStubFactory = new EventStubFactory();
    const testSource: TelemetryEventSource = -1 as TelemetryEventSource;
    const dispatcherMock = Mock.ofType<ActionMessageDispatcher>();
    let telemetryFactoryMock: IMock<TelemetryDataFactory>;
    let testSubject: ScopingActionMessageCreator;

    beforeEach(() => {
        dispatcherMock.reset();
        telemetryFactoryMock = Mock.ofType(TelemetryDataFactory, MockBehavior.Strict);
        testSubject = new ScopingActionMessageCreator(
            telemetryFactoryMock.object,
            testSource,
            dispatcherMock.object,
        );
    });

    it('dispatches message for addSelector', () => {
        const event = eventStubFactory.createMouseClickEvent() as any;
        const inputType = 'test';
        const telemetry: ScopingTelemetryData = {
            triggeredBy: 'mouseclick',
            source: testSource,
            inputType: inputType,
        };

        const testSelector: string[] = ['iFrame', 'selector'];

        const expectedMessage: Message = {
            messageType: Messages.Scoping.AddSelector,
            payload: {
                inputType: inputType,
                selector: testSelector,
                telemetry: telemetry,
            },
        };

        telemetryFactoryMock
            .setup(tf => tf.forAddSelector(event, inputType, testSource))
            .returns(() => telemetry)
            .verifiable(Times.once());

        testSubject.addSelector(event, inputType, testSelector);
        telemetryFactoryMock.verifyAll();
        dispatcherMock.verify(
            dispatcher => dispatcher.dispatchMessage(expectedMessage),
            Times.once(),
        );
    });

    it('dispatches message for deleteSelector', () => {
        const event = eventStubFactory.createMouseClickEvent() as any;
        const inputType = 'test';
        const telemetry: ScopingTelemetryData = {
            triggeredBy: 'mouseclick',
            source: testSource,
            inputType: inputType,
        };

        const testSelector: string[] = ['iFrame', 'selector'];

        const expectedMessage: Message = {
            messageType: Messages.Scoping.DeleteSelector,
            payload: {
                inputType: inputType,
                selector: testSelector,
                telemetry: telemetry,
            },
        };

        telemetryFactoryMock
            .setup(tf => tf.forDeleteSelector(event, inputType, testSource))
            .returns(() => telemetry)
            .verifiable(Times.once());

        testSubject.deleteSelector(event, inputType, testSelector);
        telemetryFactoryMock.verifyAll();
        dispatcherMock.verify(
            dispatcher => dispatcher.dispatchMessage(expectedMessage),
            Times.once(),
        );
    });
});
