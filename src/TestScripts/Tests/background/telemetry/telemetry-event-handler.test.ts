// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as _ from 'lodash';
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';

import { BaseActionPayload } from '../../../../background/actions/action-payloads';
import { ChromeAdapter, IChromeAdapter } from '../../../../background/browser-adapter';
import { TelemetryClient } from '../../../../background/telemetry/telemetry-client';
import { TelemetryEventHandler } from '../../../../background/telemetry/telemetry-event-handler';
import { ITab } from '../../../../common/itab';
import { title } from '../../../../content/strings/application';

describe('TelemetryEventHandlerTest', () => {
    let browserAdapterMock: IMock<IChromeAdapter>;
    let telemetryClientStrictMock: IMock<TelemetryClient>;
    let testEventName;
    let testTelemetryPayload;
    let testTabId;
    let resultTab;

    beforeEach(() => {
        testTabId = 1;
        resultTab = {
            id: testTabId,
            title: 'test title with email@domain',
            url: 'https://test.url/email@domain/',
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
        telemetryClientStrictMock
            .setup(te => te.trackEvent(It.isAny(), It.isAny()))
            .verifiable(Times.never());

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
        setupTrackEvent(
            testEventName,
            expectedTelemetry,
        );

        const testObject = createAndEnableTelemetryEventHandler();

        testObject.publishTelemetry(testEventName, testTelemetryPayload, testTabId);

        verifyMocks();
    });

    test('test for publishTelemetry when tab is not null, and logUrl is false', () => {
        const expectedTelemetry = createExpectedAppInsightsTelemetry(
            null,
            false,
        );

        setupBrowserAdapter(testTabId, resultTab);
        setupTrackEvent(
            testEventName,
            expectedTelemetry,
        );

        const testObject = createAndEnableTelemetryEventHandler();

        testObject.publishTelemetry(
            testEventName,
            testTelemetryPayload,
            testTabId,
            false,
        );

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

        const expectedTelemetry = createExpectedAppInsightsTelemetry(
            extraFields,
        );

        setupBrowserAdapter(testTabId, resultTab);
        setupTrackEvent(
            testEventName,
            expectedTelemetry,
        );

        const testObject = createAndEnableTelemetryEventHandler();

        testObject.publishTelemetry(
            testEventName,
            customTelemetryPayload,
            testTabId,
        );

        verifyMocks();
    });

    test('removeEmail', () => {
        const testObject = createAndEnableTelemetryEventHandler();

        testRemoveEmail(testObject, null, 'null');
        testRemoveEmail(testObject, undefined, 'undefined');
        testRemoveEmail(testObject, '', '');
        testRemoveEmail(testObject, 'a', 'a');
        testRemoveEmail(
            testObject,
            'test without any matches #@$! @twitter',
            'test without any matches #@$! @twitter',
        );
        testRemoveEmail(testObject, 'dummy@email.com', '(email-removed)');
        testRemoveEmail(
            testObject,
            'prefix dummy@email.com',
            'prefix (email-removed)',
        );
        testRemoveEmail(
            testObject,
            'dummy@email.com suffix',
            '(email-removed) suffix',
        );
        testRemoveEmail(
            testObject,
            // tslint:disable-next-line:max-line-length
            'https://test.com/_#/faq-tbot/19:c677b5ef-702c-47e0-8c87-d0fdba80af2e_90a27c51-5c74-453b-944a-134ba86da790@unq.gbl.spaces?ctx=chat',
            'https://test.com/_#/faq-tbot/19:(email-removed)?ctx=chat',
        );
        testRemoveEmail(
            testObject,
            // tslint:disable-next-line:max-line-length
            'https://test.com/_?container=80683-merge-prod-1350842#/test/Framework%20&%20UX%20Platform/19:test_f7ede4dae12742fbb2314bc94dc5c7d2@thread.test/td.members',
            // tslint:disable-next-line:max-line-length
            'https://test.com/_?container=80683-merge-prod-1350842#/test/Framework%20&%20UX%20Platform/19:(email-removed)/td.members',
        );
        testRemoveEmail(
            testObject,
            'Inbox (680) - dummy@email.com - Gmail',
            'Inbox (680) - (email-removed) - Gmail',
        );
    });

    function createExpectedAppInsightsTelemetry(
        customFields?: IDictionaryStringTo<any>,
        isUrlExpected: boolean = true,
    ) {
        const telemetry: any = {
            source: undefined,
            triggeredBy: 'triggered by test',
        };

        if (isUrlExpected) {
            telemetry.url = 'https://test.url/(email-removed)/';
            telemetry.title = 'test title with (email-removed)';
        }

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
            .setup(cam =>
                cam.getTab(
                    It.isValue(tabId),
                    It.is((param: () => void) => param instanceof Function),
                ),
            )
            .callback((tabId, callback) => {
                callback(resultTab);
            })
            .verifiable(Times.once());
    }

    function createAndEnableTelemetryEventHandler(): TelemetryEventHandler {
        const telemetryEventHandler = new TelemetryEventHandler(
            browserAdapterMock.object,
            telemetryClientStrictMock.object,
        );
        telemetryClientStrictMock
            .setup(ai => ai.enableTelemetry())
            .verifiable(Times.once());

        telemetryEventHandler.enableTelemetry();
        return telemetryEventHandler;
    }

    function setupTrackEvent(
        eventName: string,
        expectedTelemetry: IDictionaryStringTo<string>,
    ) {
        telemetryClientStrictMock
            .setup(te => te.trackEvent(It.isValue(eventName), It.isValue(expectedTelemetry)))
            .verifiable(Times.once());
    }

    function testRemoveEmail(
        testObject: TelemetryEventHandler,
        s: string,
        expected: string,
    ) {
        const actual: string = (testObject as any).removeEmail(s);
        expect(actual).toEqual(expected);
    }
});
