// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IConfig, ITelemetryContext, ITelemetryTrace } from '@microsoft/applicationinsights-common';
import { ApplicationInsights, IConfiguration } from '@microsoft/applicationinsights-web';
import {
    AppInsightsTelemetryClient,
    ExtendedTelemetryItem,
} from 'background/telemetry/app-insights-telemetry-client';
import { ApplicationTelemetryDataFactory } from 'background/telemetry/application-telemetry-data-factory';
import { configMutator } from 'common/configuration';
import { cloneDeep } from 'lodash';
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';

describe('AppInsights telemetry client tests', () => {
    let appInsightsStrictMock: IMock<ApplicationInsights>;
    let coreTelemetryDataFactoryMock: IMock<ApplicationTelemetryDataFactory>;
    let telemetryTraceStub: ITelemetryTrace;
    let testSubject: AppInsightsTelemetryClient;
    const aiKey: string = 'ai key';
    let addTelemetryInitializerCallback: (telemetryItem: ExtendedTelemetryItem) => boolean;
    let aiConfig: IConfiguration & IConfig;
    const coreTelemetryData = {
        coreProp1: 'some value',
        coreProp2: 2,
    };

    afterEach(() => {
        configMutator.reset();
    });

    beforeEach(() => {
        aiConfig = {};
        configMutator.setOption('appInsightsInstrumentationKey', aiKey);
        telemetryTraceStub = {
            name: 'should be overwritten to an empty string',
        } as ITelemetryTrace;
        appInsightsStrictMock = Mock.ofType<ApplicationInsights>(null, MockBehavior.Strict);
        coreTelemetryDataFactoryMock = Mock.ofType<ApplicationTelemetryDataFactory>();

        coreTelemetryDataFactoryMock
            .setup(c => c.getData())
            .returns(() => cloneDeep(coreTelemetryData as any));

        testSubject = new AppInsightsTelemetryClient(
            coreTelemetryDataFactoryMock.object,
            appInsightsStrictMock.object,
        );
    });

    describe('enableTelemetry', () => {
        test('verify first enable telemetry call', () => {
            invokeFirstEnableTelemetryCall();

            appInsightsStrictMock.verifyAll();

            const extendedTelemetryItemStub = getTelemetryItemStub();

            const returnVal = addTelemetryInitializerCallback(extendedTelemetryItemStub as any);

            expect(returnVal).toBe(true);
            verifyBaseDataProperties(extendedTelemetryItemStub);
            expect(telemetryTraceStub.name).toEqual('');
        });

        test('verify disableTelemetry config updated', () => {
            aiConfig.disableTelemetry = true;
            invokeFirstEnableTelemetryCall();

            expect(aiConfig).toEqual({
                disableTelemetry: false,
            } as IConfiguration & IConfig);
            expect(telemetryTraceStub.name).toEqual('');
        });

        test('2nd call after initialization', () => {
            invokeFirstEnableTelemetryCall();

            testSubject.disableTelemetry();

            expect(aiConfig).toEqual({
                disableTelemetry: true,
            } as IConfiguration & IConfig);

            testSubject.enableTelemetry();

            expect(aiConfig).toEqual({
                disableTelemetry: false,
            } as IConfiguration & IConfig);
            expect(telemetryTraceStub.name).toEqual('');
        });

        test('do nothing if already enabled', () => {
            setupAppInsightsConfig();
            invokeFirstEnableTelemetryCall();

            appInsightsStrictMock.reset();
            testSubject.enableTelemetry();
        });
    });

    describe('disableTelemetry', () => {
        test('do nothing if already disabled', () => {
            aiConfig.disableTelemetry = true;
            testSubject.disableTelemetry();
            expect(aiConfig).toEqual({
                disableTelemetry: true,
            } as IConfiguration & IConfig);
        });

        test('when not already disabled', () => {
            invokeFirstEnableTelemetryCall();

            setupAppInsightsConfig();
            expect(aiConfig).toEqual({
                disableTelemetry: false,
            } as IConfiguration & IConfig);
            testSubject.disableTelemetry();
            expect(aiConfig).toEqual({
                disableTelemetry: true,
            } as IConfiguration & IConfig);
            expect(telemetryTraceStub.name).toEqual('');
        });
    });

    describe('trackEvent', () => {
        test('calls appInsights trackEvent', () => {
            invokeFirstEnableTelemetryCall();

            const eventName: string = 'testEvent';
            const eventObject = {
                test: 'a',
            };

            appInsightsStrictMock
                .setup(ai => ai.trackEvent({ name: eventName }, eventObject))
                .verifiable(Times.once());

            testSubject.trackEvent(eventName, eventObject);

            appInsightsStrictMock.verifyAll();
            expect(telemetryTraceStub.name).toEqual('');
        });

        test('do nothing if not initialized', () => {
            const eventName: string = 'testEvent';
            const eventObject = {
                test: 'a',
            };
            appInsightsStrictMock
                .setup(ai => ai.trackEvent({ name: eventName }, eventObject))
                .verifiable(Times.never());

            testSubject.trackEvent(eventName, eventObject);
            appInsightsStrictMock.verifyAll();
        });

        test('do nothing when not enabled', () => {
            invokeFirstEnableTelemetryCall();

            const eventName: string = 'testEvent';
            const eventObject = {
                test: 'a',
            };

            appInsightsStrictMock
                .setup(ai => ai.trackEvent({ name: eventName }, eventObject))
                .verifiable(Times.exactly(2));

            testSubject.trackEvent(eventName, eventObject);
            testSubject.disableTelemetry();
            testSubject.trackEvent(eventName, eventObject);
            testSubject.enableTelemetry();
            testSubject.trackEvent(eventName, eventObject);

            expect(telemetryTraceStub.name).toEqual('');
        });
    });

    function verifyBaseDataProperties(extendedTelemetryItem: ExtendedTelemetryItem): void {
        expect(extendedTelemetryItem.data.baseData.properties).toMatchObject(coreTelemetryData);

        expect(extendedTelemetryItem.data.baseData).toMatchObject(
            getTelemetryItemStub().data.baseData,
        );
    }

    function setupAddTelemetryInitializerCall(): void {
        appInsightsStrictMock
            .setup(ai =>
                ai.addTelemetryInitializer(
                    It.is(param => {
                        return typeof param === 'function';
                    }),
                ),
            )
            .returns(callback => {
                addTelemetryInitializerCallback = callback;
            })
            .verifiable(Times.once());
    }

    function getTelemetryItemStub(): ExtendedTelemetryItem {
        return {
            data: {
                baseData: {
                    properties: {
                        someProp1: '',
                    } as any,
                },
            },
        } as ExtendedTelemetryItem;
    }

    function setupAppInsightsContext(): void {
        appInsightsStrictMock
            .setup(ai => ai.context)
            .returns(() => getAppInsightsContext())
            .verifiable(Times.once());
    }

    function getAppInsightsContext(): ITelemetryContext {
        return {
            telemetryTrace: telemetryTraceStub,
        } as any;
    }

    function invokeFirstEnableTelemetryCall(): void {
        setupLoadAppInsightsCall();
        setupAppInsightsContext();
        setupAddTelemetryInitializerCall();
        setupAppInsightsConfig();
        testSubject.enableTelemetry();
    }

    function setupLoadAppInsightsCall(): void {
        appInsightsStrictMock.setup(ai => ai.loadAppInsights()).verifiable(Times.once());
    }

    function setupAppInsightsConfig(): void {
        appInsightsStrictMock.setup(ai => ai.config).returns(() => aiConfig);
    }
});
