// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as _ from 'lodash';
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';

import { BaseActionPayload } from '../../../../../background/actions/action-payloads';
import { BrowserAdapter, ChromeAdapter } from '../../../../../background/browser-adapter';
import { TelemetryClient } from '../../../../../background/telemetry/telemetry-client';
import { TelemetryEventHandler } from '../../../../../background/telemetry/telemetry-event-handler';
import { ITab } from '../../../../../common/itab';

describe('TelemetryEventHandlerTest', () => {
    let browserAdapterMock: IMock<BrowserAdapter>;
    let telemetryClientStrictMock: IMock<TelemetryClient>;
    let testEventName;
    let testTelemetryPayload;
    let testTabId;
    let resultTab;

    beforeEach(() => {
        testTabId = 1;
        resultTab = {
            id: testTabId,
        };
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
        testObject.publishTelemetry(testEventName, payload, testTabId);

        browserAdapterMock.verifyAll();
    });

    test('test for when tab is null', () => {
        const payload: BaseActionPayload = {
            telemetry: {
                source: -1,
                triggeredBy: 'triggered by test',
            },
        };

        setupBrowserAdapter(testTabId, null);
        telemetryClientStrictMock.setup(te => te.trackEvent(It.isAny(), It.isAny())).verifiable(Times.never());

        const testObject = createAndEnableTelemetryEventHandler();
        testObject.publishTelemetry(testEventName, testTelemetryPayload, testTabId);

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

        setupBrowserAdapter(testTabId, resultTab);
        setupTrackEvent(testEventName, expectedTelemetry);

        const testObject = createAndEnableTelemetryEventHandler();

        testObject.publishTelemetry(testEventName, testTelemetryPayload, testTabId);

        verifyMocks();
    });

    test('test for publishTelemetry with random object as custom property', () => {
        const extraFields: IDictionaryStringTo<any> = {
            ___featureA: {
                __featureB__: {
                    _featureC_: 'hello world',
                },
            },
        };

        const customTelemetryPayload = {
            telemetry: {
                source: -1,
                triggeredBy: 'triggered by test',
                ___featureA: {
                    __featureB__: {
                        _featureC_: 'hello world',
                    },
                },
            },
        };

        const expectedTelemetry = createExpectedAppInsightsTelemetry(extraFields);

        setupBrowserAdapter(testTabId, resultTab);
        setupTrackEvent(testEventName, expectedTelemetry);

        const testObject = createAndEnableTelemetryEventHandler();

        testObject.publishTelemetry(testEventName, customTelemetryPayload, testTabId);

        verifyMocks();
    });

    function createExpectedAppInsightsTelemetry(customFields?: IDictionaryStringTo<any>) {
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

    function setupBrowserAdapter(tabId: number, resultTab: ITab): void {
        browserAdapterMock
            .setup(cam => cam.getTab(It.isValue(tabId), It.is((param: () => void) => param instanceof Function)))
            .callback((tabId, callback) => {
                callback(resultTab);
            })
            .verifiable(Times.once());
    }

    function createAndEnableTelemetryEventHandler(): TelemetryEventHandler {
        const telemetryEventHandler = new TelemetryEventHandler(browserAdapterMock.object, telemetryClientStrictMock.object);
        telemetryClientStrictMock.setup(ai => ai.enableTelemetry()).verifiable(Times.once());

        telemetryEventHandler.enableTelemetry();
        return telemetryEventHandler;
    }

    function setupTrackEvent(eventName: string, expectedTelemetry: IDictionaryStringTo<string>) {
        telemetryClientStrictMock.setup(te => te.trackEvent(It.isValue(eventName), It.isValue(expectedTelemetry))).verifiable(Times.once());
    }
});
