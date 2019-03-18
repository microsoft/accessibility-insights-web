// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as _ from 'lodash';
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';

import { BaseActionPayload } from '../../../../../background/actions/action-payloads';
import { BrowserAdapter, ChromeAdapter } from '../../../../../background/browser-adapter';
import { TelemetryClient } from '../../../../../background/telemetry/telemetry-client';
import { TelemetryEventHandler } from '../../../../../background/telemetry/telemetry-event-handler';
import { Tab } from '../../../../../common/itab';
import { TelemetryEventSource, TriggeredBy } from '../../../../../common/telemetry-events';

describe('TelemetryEventHandlerTest', () => {
    let browserAdapterMock: IMock<BrowserAdapter>;
    let telemetryClientStrictMock: IMock<TelemetryClient>;
    let testEventName;
    let testTelemetryPayload;
    let testTabId;

    beforeEach(() => {
        testTabId = 1;
        testEventName = 'test event';
        testTelemetryPayload = {
            telemetry: {
                source: -1,
                triggeredBy: 'triggered by test',
            },
        };

        browserAdapterMock = Mock.ofType(ChromeAdapter);

        telemetryClientStrictMock = Mock.ofType<TelemetryClient>(null, MockBehavior.Strict);
    });

    test('test for when telemetry is null', () => {
        const payload: BaseActionPayload = {
            telemetry: null,
        };

        browserAdapterMock
            .setup(cam =>
                cam.getTab(
                    It.isValue(testTabId),
                    It.is((param: () => void) => {
                        return param instanceof Function;
                    }),
                ),
            )
            .verifiable(Times.never());

        const testObject = createAndEnableTelemetryEventHandler();
        testObject.publishTelemetry(testEventName, payload);

        browserAdapterMock.verifyAll();
    });

    test('test for when tab is null', () => {
        telemetryClientStrictMock.setup(te => te.trackEvent(It.isAny(), It.isAny())).verifiable(Times.once());

        const testObject = createAndEnableTelemetryEventHandler();
        testObject.publishTelemetry(testEventName, testTelemetryPayload);
        browserAdapterMock.verifyAll();
        telemetryClientStrictMock.verifyAll();
    });

    test('test for enableTelemetry in telemetryClient', () => {
        const testObject = createAndEnableTelemetryEventHandler();
        expect(testObject).toBeTruthy();

        verifyMocks();
    });

    test('test for disableTelemetry in telemetryClient', () => {
        const testObject = createAndEnableTelemetryEventHandler();

        telemetryClientStrictMock.setup(t => t.disableTelemetry()).verifiable(Times.once());
        testObject.disableTelemetry();

        verifyMocks();
    });

    test('test for publishTelemetry when tab is not null', () => {
        const expectedTelemetry = createExpectedAppInsightsTelemetry();

        setupTrackEvent(testEventName, expectedTelemetry);

        const testObject = createAndEnableTelemetryEventHandler();

        testObject.publishTelemetry(testEventName, testTelemetryPayload);

        verifyMocks();
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

        verifyMocks();
    });

    function createExpectedAppInsightsTelemetry(customFields?: DictionaryStringTo<any>) {
        const telemetry: any = {
            source: undefined,
            triggeredBy: 'triggered by test',
        };

        if (customFields) {
            _.each(customFields, (value, key) => {
                telemetry[key] = JSON.stringify(value);
            });
        }

        return telemetry;
    }

    function verifyMocks() {
        browserAdapterMock.verifyAll();
        telemetryClientStrictMock.verifyAll();
    }

    function createAndEnableTelemetryEventHandler(): TelemetryEventHandler {
        const telemetryEventHandler = new TelemetryEventHandler(browserAdapterMock.object, telemetryClientStrictMock.object);
        telemetryClientStrictMock.setup(ai => ai.enableTelemetry()).verifiable(Times.once());

        telemetryEventHandler.enableTelemetry();
        return telemetryEventHandler;
    }

    function setupTrackEvent(eventName: string, expectedTelemetry: DictionaryStringTo<string>) {
        telemetryClientStrictMock.setup(te => te.trackEvent(It.isValue(eventName), It.isValue(expectedTelemetry))).verifiable(Times.once());
    }
});
