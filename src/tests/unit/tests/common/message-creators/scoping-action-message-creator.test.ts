// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';
import { Message } from '../../../../../common/message';
import { ScopingActionMessageCreator } from '../../../../../common/message-creators/scoping-action-message-creator';
import { Messages } from '../../../../../common/messages';
import { TelemetryDataFactory } from '../../../../../common/telemetry-data-factory';
import { ScopingTelemetryData, TelemetryEventSource } from '../../../../../common/telemetry-events';
import { EventStubFactory } from './../../../common/event-stub-factory';

describe('ScopingActionMessageCreatorTest', () => {
    const eventStubFactory = new EventStubFactory();
    const testSource: TelemetryEventSource = -1 as TelemetryEventSource;
    let postMessageMock: IMock<(message: Message) => void>;
    let telemetryFactoryMock: IMock<TelemetryDataFactory>;
    let testSubject: ScopingActionMessageCreator;
    const tabId: number = -1;

    beforeEach(() => {
        postMessageMock = Mock.ofInstance(message => {});
        telemetryFactoryMock = Mock.ofType(TelemetryDataFactory, MockBehavior.Strict);
        testSubject = new ScopingActionMessageCreator(postMessageMock.object, tabId, telemetryFactoryMock.object, testSource);
    });

    test('addSelector', () => {
        const event = eventStubFactory.createMouseClickEvent() as any;
        const inputType = 'test';
        const telemetry: ScopingTelemetryData = {
            triggeredBy: 'mouseclick',
            source: testSource,
            inputType: inputType,
        };

        const testSelector: string[] = ['iFrame', 'selector'];

        const expectedMessage = {
            tabId: tabId,
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

        setupPostMessage(expectedMessage);
        testSubject.addSelector(event, inputType, testSelector);
        postMessageMock.verifyAll();
        telemetryFactoryMock.verifyAll();
    });

    test('deleteSelector', () => {
        const event = eventStubFactory.createMouseClickEvent() as any;
        const inputType = 'test';
        const telemetry: ScopingTelemetryData = {
            triggeredBy: 'mouseclick',
            source: testSource,
            inputType: inputType,
        };

        const testSelector: string[] = ['iFrame', 'selector'];

        const expectedMessage = {
            tabId: tabId,
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

        setupPostMessage(expectedMessage);
        testSubject.deleteSelector(event, inputType, testSelector);
        postMessageMock.verifyAll();
        telemetryFactoryMock.verifyAll();
    });

    function setupPostMessage(expectedMessage: Message): void {
        postMessageMock.setup(post => post(It.isValue(expectedMessage))).verifiable(Times.once());
    }
});
