// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BaseActionPayload } from 'background/actions/action-payloads';
import { TelemetryClient } from 'background/telemetry/telemetry-client';
import { TelemetryEventHandler } from 'background/telemetry/telemetry-event-handler';
import { TelemetryEventSource, TriggeredBy } from 'common/extension-telemetry-events';
import { each } from 'lodash';
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';
import { DictionaryStringTo } from 'types/common-types';

describe(TelemetryEventHandler, () => {
    let telemetryClientStrictMock: IMock<TelemetryClient>;
    let testEventName;
    let testTelemetryPayload;

    beforeEach(() => {
        testEventName = 'test event';
        testTelemetryPayload = {
            telemetry: {
                source: -1,
                triggeredBy: 'triggered by test',
            },
        };

        telemetryClientStrictMock = Mock.ofType<TelemetryClient>(null, MockBehavior.Strict);
    });

    test('should silently noop when telemetry is null', () => {
        const payload: BaseActionPayload = {
            telemetry: null,
        };

        const testObject = createAndEnableTelemetryEventHandler();
        testObject.publishTelemetry(testEventName, payload);
    });

    test('trackEvent should silently noop when not yet initialized', () => {
        const testObject = new TelemetryEventHandler();
        testObject.publishTelemetry(testEventName, testTelemetryPayload);
    });

    test('test for when tab is null', () => {
        telemetryClientStrictMock
            .setup(te => te.trackEvent(It.isAny(), It.isAny()))
            .verifiable(Times.once());

        const testObject = createAndEnableTelemetryEventHandler();
        testObject.publishTelemetry(testEventName, testTelemetryPayload);
        telemetryClientStrictMock.verifyAll();
    });

    test('test for enableTelemetry in telemetryClient', () => {
        const testObject = createAndEnableTelemetryEventHandler();
        expect(testObject).toBeTruthy();

        telemetryClientStrictMock.verifyAll();
    });

    test('test for disableTelemetry in telemetryClient', () => {
        const testObject = createAndEnableTelemetryEventHandler();

        telemetryClientStrictMock.setup(t => t.disableTelemetry()).verifiable(Times.once());
        testObject.disableTelemetry();

        telemetryClientStrictMock.verifyAll();
    });

    test('test for publishTelemetry when tab is not null', () => {
        const expectedTelemetry = createExpectedAppInsightsTelemetry();

        setupTrackEvent(testEventName, expectedTelemetry);

        const testObject = createAndEnableTelemetryEventHandler();

        testObject.publishTelemetry(testEventName, testTelemetryPayload);

        telemetryClientStrictMock.verifyAll();
    });

    test('test for publishTelemetry with random object as custom property', () => {
        const extraFields: DictionaryStringTo<any> = {
            ___featureA: {
                __featureB__: {
                    _featureC_: 'hello world',
                },
            },
        };

        const customTelemetryPayload = {
            telemetry: {
                source: -1 as TelemetryEventSource,
                triggeredBy: 'triggered by test' as TriggeredBy,
                ___featureA: {
                    __featureB__: {
                        _featureC_: 'hello world',
                    },
                },
            },
        };

        const expectedTelemetry = createExpectedAppInsightsTelemetry(extraFields);

        setupTrackEvent(testEventName, expectedTelemetry);

        const testObject = createAndEnableTelemetryEventHandler();

        testObject.publishTelemetry(testEventName, customTelemetryPayload);

        telemetryClientStrictMock.verifyAll();
    });

    function createExpectedAppInsightsTelemetry(
        customFields?: DictionaryStringTo<any>,
    ): DictionaryStringTo<string> {
        const telemetry: any = {
            source: undefined,
            triggeredBy: 'triggered by test',
        };

        if (customFields) {
            each(customFields, (value, key) => {
                telemetry[key] = JSON.stringify(value);
            });
        }

        return telemetry;
    }

    function createAndEnableTelemetryEventHandler(): TelemetryEventHandler {
        const telemetryEventHandler = new TelemetryEventHandler();
        telemetryEventHandler.initialize(telemetryClientStrictMock.object);
        telemetryClientStrictMock.setup(ai => ai.enableTelemetry()).verifiable(Times.once());

        telemetryEventHandler.enableTelemetry();
        return telemetryEventHandler;
    }

    function setupTrackEvent(
        eventName: string,
        expectedTelemetry: DictionaryStringTo<string>,
    ): void {
        telemetryClientStrictMock
            .setup(te => te.trackEvent(It.isValue(eventName), It.isValue(expectedTelemetry)))
            .verifiable(Times.once());
    }
});
