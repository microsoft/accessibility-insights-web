// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import {
    BrowserAdapterEventManager,
    ApplicationListener,
    AdapterListener,
    DeferredEventDetails,
} from 'common/browser-adapters/browser-adapter-event-manager';
import { ExternalResolutionPromise, PromiseFactory } from 'common/promises/promise-factory';
import { IMock, It, Mock, Times } from 'typemoq';
import { DictionaryStringTo } from 'types/common-types';
import { Events } from 'webextension-polyfill';

class TestableBrowserAdapterEventManager extends BrowserAdapterEventManager {
    public getDeferredEvents() {
        return this.deferredEvents;
    }

    public setDeferredEvents(events: DeferredEventDetails[]) {
        this.deferredEvents = events;
    }

    public getEventsToApplicationListenersMapping() {
        return this.eventsToApplicationListenersMapping;
    }

    public setEventsToApplicationListenersMapping(
        mapping: DictionaryStringTo<ApplicationListener>,
    ) {
        this.eventsToApplicationListenersMapping = mapping;
    }

    public getEventsToAdapterListenersMapping() {
        return this.eventsToAdapterListenersMapping;
    }

    public setEventsToAdapterListenersMapping(mapping: DictionaryStringTo<AdapterListener>) {
        this.eventsToAdapterListenersMapping = mapping;
    }

    public getHandleEvent() {
        return this.handleEvent;
    }

    public setHandleEvent(listener: (eventType: string) => AdapterListener) {
        this.handleEvent = listener;
    }
}

describe('BrowserAdapterEventManager', () => {
    let validator: BrowserAdapterEventManagerValidator;
    const testEventType = 'test1';
    const testArgs = ['arg1'];
    const testApplicationListener = (name: string) => name;

    beforeEach(() => {
        validator = new BrowserAdapterEventManagerValidator();
    });

    it('registerAdapterListenerForEvent adds adapter listener bound to eventType to eventAPI', () => {
        const testSubject = validator.buildBrowserAdapterEventManager();
        const mockAdapterListener = validator.setupMockAdapterListener(testArgs, 0);
        const mockHandleEvent = validator.setupHandleEvent(
            mockAdapterListener.object,
            testEventType,
            1,
        );
        validator.setTestSubjectProperties(testSubject, {
            handleEvent: mockHandleEvent.object,
        });
        const mockEventAPI = validator.setupMockEventAPIAddListener(mockAdapterListener.object, 1);
        testSubject.registerAdapterListenerForEvent(mockEventAPI.object, testEventType);
        expect(testSubject.getEventsToAdapterListenersMapping()[testEventType]).toBe(
            mockAdapterListener.object,
        );
        validator.verifyAll();
        mockEventAPI.verifyAll();
        mockAdapterListener.verifyAll();
    });

    it('registerEventToApplicationListener creates a new mapping if no events are found for eventType', () => {
        const testSubject = validator.buildBrowserAdapterEventManager();
        expect(testSubject.getEventsToApplicationListenersMapping()[testEventType]).toBe(undefined);
        testSubject.registerEventToApplicationListener(testEventType, testApplicationListener);
        expect(testSubject.getEventsToApplicationListenersMapping()[testEventType]).toStrictEqual(
            testApplicationListener,
        );
        validator.verifyAll();
    });

    it('processEvent calls registered listener and starts 2-minute delay for undefined results', () => {
        const mockApplicationListener = validator.setupMockFireAndForgetApplicationListener(
            testArgs,
            1,
        );
        const testSubject = validator.buildBrowserAdapterEventManagerWithProperties({
            eventsToApplicationListenersMapping: {
                [testEventType]: mockApplicationListener.object,
            },
        });
        validator.setupPromiseFactoryDelay(2, 1);
        testSubject.processEvent(testEventType, testArgs);
        validator.verifyAll();
        mockApplicationListener.verifyAll();
    });

    it('processEvent passes multiple args through to registered listener', () => {
        const multiArgs = ['a', 1, null];
        const mockApplicationListener = validator.setupMockFireAndForgetApplicationListener(
            multiArgs,
            1,
        );
        const testSubject = validator.buildBrowserAdapterEventManagerWithProperties({
            eventsToApplicationListenersMapping: {
                [testEventType]: mockApplicationListener.object,
            },
        });
        validator.setupPromiseFactoryDelay(2, 1);
        testSubject.processEvent(testEventType, multiArgs);
        validator.verifyAll();
        mockApplicationListener.verifyAll();
    });

    it('processEvent calls registered listener and starts 4-minute delay for promise results', () => {
        const mockApplicationListener = validator.setupMockAsyncApplicationListener(testArgs, 1);
        const testSubject = validator.buildBrowserAdapterEventManagerWithProperties({
            eventsToApplicationListenersMapping: {
                [testEventType]: mockApplicationListener.object,
            },
        });
        validator.setupPromiseFactoryDelay(4, 1);
        testSubject.processEvent(testEventType, testArgs);
        validator.verifyAll();
        mockApplicationListener.verifyAll();
    });

    it('processEvent calls registered listener and logs an error for non-promise, non-undefined return values', () => {
        const mockApplicationListener = validator.setupMockPlainReturnApplicationListener(
            testArgs,
            1,
        );
        const testSubject = validator.buildBrowserAdapterEventManagerWithProperties({
            eventsToApplicationListenersMapping: {
                [testEventType]: mockApplicationListener.object,
            },
        });
        testSubject
            .processEvent(testEventType, testArgs)
            .catch(error =>
                expect(error).toBe(`Application listener returned a non-promise result`),
            );
        validator.verifyAll();
        mockApplicationListener.verifyAll();
    });

    it('processEvent returns null if no listeners are available', () => {
        const testSubject = validator.buildBrowserAdapterEventManager();
        expect(testSubject.processEvent(testEventType, testArgs)).toBeNull();

        validator.verifyAll();
    });

    it('handleEvent defers event if processEvent returns null', () => {
        const testSubject = validator.buildBrowserAdapterEventManager();

        const eventDetails = {
            eventType: testEventType,
            eventArgs: testArgs,
        };
        validator.setupPromiseFactoryDelay(2, 0).setupExternalResolutionPromise(1);
        expect(testSubject.getDeferredEvents().length).toBe(0);
        const adapterListener: AdapterListener = testSubject.getHandleEvent()(testEventType);
        adapterListener(...testArgs);
        expect(testSubject.getDeferredEvents().length).toBe(1);
        expect(testSubject.getDeferredEvents()[0].eventType).toEqual(eventDetails.eventType);
        expect(testSubject.getDeferredEvents()[0].eventArgs).toStrictEqual(eventDetails.eventArgs);
        expect(testSubject.getDeferredEvents()[0].deferredResolution).toBeDefined();

        validator.verifyAll();
    });

    it('registerEventToApplicationListener processes deferred events for eventType', () => {
        const mockDeferredResolution = Mock.ofType<ExternalResolutionPromise>();
        mockDeferredResolution
            .setup(d => d.resolveHook)
            .returns(() => value => value)
            .verifiable(Times.once());
        const mockApplicationListener = validator.setupMockFireAndForgetApplicationListener(
            testArgs,
            1,
        );
        const testSubject = validator.buildBrowserAdapterEventManagerWithProperties({
            deferredEvents: [
                {
                    eventType: testEventType,
                    eventArgs: testArgs,
                    deferredResolution: mockDeferredResolution.object,
                },
                {
                    eventType: `${testEventType}-2`,
                    eventArgs: testArgs,
                    deferredResolution: {
                        promise: new Promise((resolve, reject) => 'hello'),
                        resolveHook: value => value,
                        rejectHook: reason => reason,
                    },
                },
            ],
        });
        testSubject.registerEventToApplicationListener(
            testEventType,
            mockApplicationListener.object,
        );
        expect(testSubject.getDeferredEvents().length).toBe(1);
        mockApplicationListener.verifyAll();
        mockDeferredResolution.verifyAll();
    });

    it('removeListener calls removeListener on eventAPI and removes listeners from mappings', () => {
        const mockAdapterListener = validator.setupMockAdapterListener(testArgs, 0);
        const testSubject = validator.buildBrowserAdapterEventManagerWithProperties({
            eventsToApplicationListenersMapping: {
                [testEventType]: testApplicationListener,
            },
            eventsToAdapterListenersMapping: {
                [testEventType]: mockAdapterListener.object,
            },
        });
        const mockEventAPI = validator.setupMockEventAPIRemoveListener(
            mockAdapterListener.object,
            1,
        );
        testSubject.removeListener(mockEventAPI.object, testEventType);
        expect(testSubject.getEventsToApplicationListenersMapping()[testEventType]).toBeUndefined();
        expect(testSubject.getEventsToAdapterListenersMapping()[testEventType]).toBeUndefined();
        validator.verifyAll();
        mockEventAPI.verifyAll();
        mockAdapterListener.verifyAll();
    });
});

type BrowserAdapterEventManagerProperties = {
    deferredEvents?: DeferredEventDetails[];
    eventsToApplicationListenersMapping?: DictionaryStringTo<ApplicationListener>;
    eventsToAdapterListenersMapping?: DictionaryStringTo<AdapterListener>;
    handleEvent?: (eventType: string) => AdapterListener;
};
class BrowserAdapterEventManagerValidator {
    private mockPromiseFactory: IMock<PromiseFactory>;
    private mockHandleEvent: IMock<(eventType: string) => AdapterListener>;
    public buildBrowserAdapterEventManager(): TestableBrowserAdapterEventManager {
        this.mockPromiseFactory = Mock.ofType<PromiseFactory>();
        this.mockHandleEvent = Mock.ofType<(eventType: string) => AdapterListener>();

        return new TestableBrowserAdapterEventManager(this.mockPromiseFactory.object);
    }

    public buildBrowserAdapterEventManagerWithProperties(
        properties: BrowserAdapterEventManagerProperties,
    ): TestableBrowserAdapterEventManager {
        this.mockPromiseFactory = Mock.ofType<PromiseFactory>();
        this.mockHandleEvent = Mock.ofType<(eventType: string) => AdapterListener>();

        const testSubject = new TestableBrowserAdapterEventManager(this.mockPromiseFactory.object);

        return this.setTestSubjectProperties(testSubject, properties);
    }

    public setTestSubjectProperties(
        testSubject: TestableBrowserAdapterEventManager,
        properties: BrowserAdapterEventManagerProperties,
    ) {
        Object.keys(properties).forEach(key => {
            switch (key) {
                case 'deferredEvents':
                    testSubject.setDeferredEvents(properties[key]);
                    break;
                case 'eventsToApplicationListenersMapping':
                    testSubject.setEventsToApplicationListenersMapping(properties[key]);
                    break;
                case 'eventsToAdapterListenersMapping':
                    testSubject.setEventsToAdapterListenersMapping(properties[key]);
                    break;
                case 'handleEvent':
                    testSubject.setHandleEvent(properties[key]);
                    break;
            }
        });
        return testSubject;
    }

    public setupHandleEvent(listener: AdapterListener, eventType: string, times: number) {
        this.mockHandleEvent
            .setup(a => a(eventType))
            .returns(() => listener)
            .verifiable(Times.exactly(times));

        return this.mockHandleEvent;
    }

    public setupMockEventAPIAddListener(listener: AdapterListener, times: number) {
        const mockEventAPI: IMock<Events.Event<any>> = Mock.ofType<Events.Event<any>>();
        mockEventAPI.setup(e => e.addListener(listener)).verifiable(Times.exactly(times));
        return mockEventAPI;
    }

    public setupMockEventAPIRemoveListener(listener: AdapterListener, times: number) {
        const mockEventAPI: IMock<Events.Event<any>> = Mock.ofType<Events.Event<any>>();
        mockEventAPI.setup(e => e.removeListener(listener)).verifiable(Times.exactly(times));
        return mockEventAPI;
    }

    public setupPromiseFactoryDelay(
        delayInMinutes: number,
        times: number,
    ): BrowserAdapterEventManagerValidator {
        this.mockPromiseFactory
            .setup(p => p.delay(It.isAny(), delayInMinutes * 60000))
            .verifiable(Times.exactly(times));

        return this;
    }

    public setupExternalResolutionPromise(times: number): BrowserAdapterEventManagerValidator {
        this.mockPromiseFactory
            .setup(p => p.externalResolutionPromise())
            .returns(() => {
                return {
                    promise: new Promise((resolve, reject) => null),
                    resolveHook: (value: any) => value,
                    rejectHook: (reason: any) => reason,
                };
            })
            .verifiable(Times.exactly(times));

        return this;
    }

    public setupMockAdapterListener(listenerArgs: any[], times: number) {
        const mockAdapterListener: IMock<AdapterListener> = Mock.ofType<AdapterListener>();
        mockAdapterListener
            .setup(l => l(listenerArgs))
            .returns(() => true)
            .verifiable(Times.exactly(times));
        return mockAdapterListener;
    }

    public setupMockFireAndForgetApplicationListener(listenerArgs: any[], times: number) {
        const mockApplicationListener: IMock<ApplicationListener> =
            Mock.ofType<ApplicationListener>();
        mockApplicationListener
            .setup(l => l(...listenerArgs))
            .returns(() => undefined)
            .verifiable(Times.exactly(times));
        return mockApplicationListener;
    }

    public setupMockAsyncApplicationListener(listenerArgs: any[], times: number) {
        const mockApplicationListener: IMock<ApplicationListener> =
            Mock.ofType<ApplicationListener>();
        mockApplicationListener
            .setup(l => l(...listenerArgs))
            .returns(() => new Promise((resolve, reject) => resolve(true)))
            .verifiable(Times.exactly(times));

        return mockApplicationListener;
    }

    public setupMockPlainReturnApplicationListener(listenerArgs: any[], times: number) {
        const mockApplicationListener: IMock<ApplicationListener> =
            Mock.ofType<ApplicationListener>();
        mockApplicationListener
            .setup(l => l(...listenerArgs))
            .returns(() => true)
            .verifiable(Times.exactly(times));

        return mockApplicationListener;
    }

    public verifyAll(): void {
        this.mockPromiseFactory.verifyAll();
        this.mockHandleEvent.verifyAll();
    }

    public resetVerify(): void {
        this.mockPromiseFactory.reset();
        this.mockHandleEvent.reset();
    }
}
