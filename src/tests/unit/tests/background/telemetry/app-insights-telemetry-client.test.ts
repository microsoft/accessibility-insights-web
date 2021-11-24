// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    AppInsightsTelemetryClient,
    ExtendedEnvelope,
} from 'background/telemetry/app-insights-telemetry-client';
import { ApplicationTelemetryDataFactory } from 'background/telemetry/application-telemetry-data-factory';
import { configMutator } from 'common/configuration';
import { cloneDeep } from 'lodash';
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';

describe('AppInsights telemetry client tests', () => {
    let addTelemetryInitializerStrictMock: IMock<(callback) => void>;
    let appInsightsStrictMock: IMock<Microsoft.ApplicationInsights.IAppInsights>;
    let coreTelemetryDataFactoryMock: IMock<ApplicationTelemetryDataFactory>;
    let operationStub: Microsoft.ApplicationInsights.Context.IOperation;
    let testSubject: AppInsightsTelemetryClient;
    const aiKey: string = 'ai key';
    let queue: Array<() => void>;
    let addTelemetryInitializerCallback: (envelope: ExtendedEnvelope) => boolean;
    let aiConfig: Microsoft.ApplicationInsights.IConfig;
    const coreTelemetryData = {
        coreProp1: 'some value',
        coreProp2: 2,
    };

    afterEach(() => {
        configMutator.reset();
    });

    beforeEach(() => {
        queue = [];
        aiConfig = {};
        configMutator.setOption('appInsightsInstrumentationKey', aiKey);
        addTelemetryInitializerStrictMock = Mock.ofInstance(callback => {}, MockBehavior.Strict);
        operationStub = {
            name: 'should be overwritten to an empty string',
        } as Microsoft.ApplicationInsights.Context.IOperation;
        appInsightsStrictMock = Mock.ofType<Microsoft.ApplicationInsights.IAppInsights>(
            null,
            MockBehavior.Strict,
        );
        coreTelemetryDataFactoryMock = Mock.ofType<ApplicationTelemetryDataFactory>();

        coreTelemetryDataFactoryMock
            .setup(c => c.getData())
            .returns(() => cloneDeep(coreTelemetryData as any));

        testSubject = new AppInsightsTelemetryClient(
            appInsightsStrictMock.object,
            coreTelemetryDataFactoryMock.object,
        );
    });

    describe('enableTelemetry', () => {
        test('verify download & setup', () => {
            invokeFirstEnableTelemetryCall();

            appInsightsStrictMock.verifyAll();
        });

        test('verify telemetryInitializer on callback', () => {
            invokeFirstEnableTelemetryCallWithCallbacks();

            addTelemetryInitializerStrictMock.verifyAll();

            const extendedEnvelopeStub = getEnvelopeStub();

            const returnVal = addTelemetryInitializerCallback(extendedEnvelopeStub as any);

            expect(returnVal).toBe(true);
            verifyBaseDataProperties(extendedEnvelopeStub);
            expect(operationStub.name).toEqual('');
        });

        test('verify disableTelemetry config on callback', () => {
            aiConfig.disableTelemetry = true;

            invokeFirstEnableTelemetryCall();
            expect(aiConfig).toEqual({
                disableTelemetry: true,
            } as Microsoft.ApplicationInsights.IConfig);

            invokeCallbacksForFirstEnableTelemetryCall();

            expect(aiConfig).toEqual({
                disableTelemetry: false,
            } as Microsoft.ApplicationInsights.IConfig);
            expect(operationStub.name).toEqual('');
        });

        test('2nd call after initialization - queue null', () => {
            invokeFirstEnableTelemetryCallWithCallbacks();

            testSubject.disableTelemetry();
            invokeAllFunctionsInQueue();
            queue = null;

            expect(aiConfig).toEqual({
                disableTelemetry: true,
            } as Microsoft.ApplicationInsights.IConfig);

            testSubject.enableTelemetry();

            expect(aiConfig).toEqual({
                disableTelemetry: false,
            } as Microsoft.ApplicationInsights.IConfig);
            expect(operationStub.name).toEqual('');
        });

        test('2nd call before initialization completed - queue not null', () => {
            invokeFirstEnableTelemetryCallWithCallbacks();
            testSubject.disableTelemetry();
            invokeAllFunctionsInQueue();
            queue = [];

            testSubject.enableTelemetry();
            expect(aiConfig).toEqual({
                disableTelemetry: true,
            } as Microsoft.ApplicationInsights.IConfig);

            invokeAllFunctionsInQueue();

            expect(aiConfig).toEqual({
                disableTelemetry: false,
            } as Microsoft.ApplicationInsights.IConfig);
            expect(operationStub.name).toEqual('');
        });

        test('do nothing if already enabled', () => {
            appInsightsStrictMock.setup(ai => ai.config).returns(() => aiConfig);
            invokeFirstEnableTelemetryCall();

            appInsightsStrictMock.reset();
            addTelemetryInitializerStrictMock.reset();
            queue = [];

            testSubject.enableTelemetry();
            expect(queue.length).toBe(0);
        });
    });

    describe('disableTelemetry', () => {
        test('do nothing if already disabled', () => {
            testSubject.disableTelemetry();

            expect(queue.length).toBe(0);
        });

        test('when initialization in progress (queue not null)', () => {
            aiConfig = { disableTelemetry: false } as Microsoft.ApplicationInsights.IConfig;
            invokeFirstEnableTelemetryCall();
            queue = [];

            appInsightsStrictMock.setup(ai => ai.config).returns(() => aiConfig);

            testSubject.disableTelemetry();

            expect(aiConfig.disableTelemetry).toBe(false);
            expect(queue.length).toBe(1);
            invokeAllFunctionsInQueue();

            expect(aiConfig.disableTelemetry).toBe(true);
        });

        test('when initialization has completed (queue is null)', () => {
            invokeFirstEnableTelemetryCallWithCallbacks();

            queue = null;

            setupAppInsightsConfig();
            setupAppInsightsQueue();

            testSubject.disableTelemetry();

            expect(aiConfig.disableTelemetry).toBe(true);
            expect(operationStub.name).toEqual('');
        });
    });

    describe('trackEvent', () => {
        test('calls appInsights trackEvent', () => {
            invokeFirstEnableTelemetryCallWithCallbacks();

            const eventName: string = 'testEvent';
            const eventObject = {
                test: 'a',
            };

            appInsightsStrictMock
                .setup(ai => ai.trackEvent(eventName, eventObject))
                .verifiable(Times.once());

            testSubject.trackEvent(eventName, eventObject);

            appInsightsStrictMock.verifyAll();
            expect(operationStub.name).toEqual('');
        });

        test('do nothing if not initialized', () => {
            const eventName: string = 'testEvent';
            const eventObject = {
                test: 'a',
            };

            testSubject.trackEvent(eventName, eventObject);
        });
    });

    function verifyBaseDataProperties(extendedEnvelope: ExtendedEnvelope): void {
        expect(extendedEnvelope.data.baseData.properties).toMatchObject(coreTelemetryData);

        expect(extendedEnvelope.data.baseData).toMatchObject(getEnvelopeStub().data.baseData);
    }

    function setupAddTelemetryInitializerCall(): void {
        addTelemetryInitializerStrictMock
            .setup(x =>
                x(
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

    function getEnvelopeStub(): ExtendedEnvelope {
        return {
            data: {
                baseData: {
                    properties: {
                        someProp1: '',
                    } as any,
                },
            },
        } as ExtendedEnvelope;
    }

    function setupAppInsightsContext(): void {
        appInsightsStrictMock
            .setup(ai => ai.context)
            .returns(() => getAppInsightsContext())
            .verifiable(Times.exactly(2));
    }

    function getAppInsightsContext(): Microsoft.ApplicationInsights.ITelemetryContext {
        return {
            addTelemetryInitializer: addTelemetryInitializerStrictMock.object,
            operation: operationStub,
        } as any;
    }

    function setupAppInsightsDownloadAndSetupCall(): void {
        appInsightsStrictMock
            .setup(ai =>
                ai.downloadAndSetup(
                    It.isValue({
                        instrumentationKey: aiKey,
                        disableTelemetry: true,
                        disableAjaxTracking: true,
                    } as Microsoft.ApplicationInsights.IConfig),
                ),
            )
            .verifiable(Times.once());
    }

    function invokeFirstEnableTelemetryCall(): void {
        setupAppInsightsQueue();
        setupAppInsightsDownloadAndSetupCall();

        testSubject.enableTelemetry();
    }

    function invokeFirstEnableTelemetryCallWithCallbacks(): void {
        invokeFirstEnableTelemetryCall();
        invokeCallbacksForFirstEnableTelemetryCall();
    }

    function invokeCallbacksForFirstEnableTelemetryCall(): void {
        setupAppInsightsContext();
        setupAddTelemetryInitializerCall();
        setupAppInsightsConfig();

        expect(queue.length).toBe(2);
        invokeAllFunctionsInQueue();
    }

    function invokeAllFunctionsInQueue(): void {
        queue.forEach(q => q());
        queue = [];
    }

    function setupAppInsightsQueue(): void {
        appInsightsStrictMock
            .setup(ai => ai.queue)
            .returns(() => queue)
            .verifiable(Times.atLeast(1));
    }

    function setupAppInsightsConfig(): void {
        appInsightsStrictMock.setup(ai => ai.config).returns(() => aiConfig);
    }
});
