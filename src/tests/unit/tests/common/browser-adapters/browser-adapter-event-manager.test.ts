// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import {
    BrowserAdapterEventManager,
    ApplicationListener,
    EventDetails,
    AdapterListener,
} from 'common/browser-adapters/browser-adapter-event-manager';
import { PromiseFactory } from 'common/promises/promise-factory';
import { IMock, It, Mock, Times } from 'typemoq';
import { DictionaryStringTo } from 'types/common-types';
import { Events } from 'webextension-polyfill';

class TestableBrowserAdapterEventManager extends BrowserAdapterEventManager {
    public getDeferredEvents() {
        return this.deferredEvents;
    }

    public setDeferredEvents(events: EventDetails[]) {
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

    public getAdapterListener() {
        return this.adapterListener;
    }

    public setAdapterListener(listener: AdapterListener) {
        this.adapterListener = listener;
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
        const mockAdapterListener = validator.setupAdapterListener(testEventType, testArgs, 1);
        validator.setTestSubjectProperties(testSubject, {
            adapterListener: mockAdapterListener.object,
        });
        const mockEventAPI = validator.setupMockEventAPIAddListener(testEventType, 1);
        testSubject.registerAdapterListenerForEvent(mockEventAPI.object, testEventType);
        validator.verifyAll();
        mockEventAPI.verifyAll();
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

    it('processEvent calls registered listener and starts timeout for non-promise results', () => {
        const mockApplicationListener = validator.setupMockApplicationListener(testArgs, 1);
        const testSubject = validator.buildBrowserAdapterEventManagerWithProperties({
            eventsToApplicationListenersMapping: {
                [testEventType]: mockApplicationListener.object,
            },
        });
        validator.setupPromiseFactory(0);
        testSubject.processEvent(testEventType, testArgs);
        validator.verifyAll();
        mockApplicationListener.verifyAll();
    });
    it('processEvent passes multiple args through to registered listener', () => {
        const multiArgs = ['a', 1, null];
        const mockApplicationListener = validator.setupMockApplicationListener(multiArgs, 1);
        const testSubject = validator.buildBrowserAdapterEventManagerWithProperties({
            eventsToApplicationListenersMapping: {
                [testEventType]: mockApplicationListener.object,
            },
        });
        validator.setupPromiseFactory(0);
        testSubject.processEvent(testEventType, multiArgs);
        validator.verifyAll();
        mockApplicationListener.verifyAll();
    });

    it('processEvent calls registered listener and starts promise race for promise results', () => {
        const mockApplicationListener = validator.setupMockAsyncApplicationListener(testArgs, 1);
        const testSubject = validator.buildBrowserAdapterEventManagerWithProperties({
            eventsToApplicationListenersMapping: {
                [testEventType]: mockApplicationListener.object,
            },
        });
        validator.setupPromiseFactory(1);
        testSubject.processEvent(testEventType, testArgs);
        validator.verifyAll();
        mockApplicationListener.verifyAll();
    });

    it('processEvent defers event if no listeners are available', () => {
        const testSubject = validator.buildBrowserAdapterEventManager();
        const eventDetails = {
            eventType: testEventType,
            eventArgs: testArgs,
        };
        validator.setupPromiseFactory(0);
        expect(testSubject.getDeferredEvents().length).toBe(0);
        testSubject.processEvent(testEventType, testArgs);
        expect(testSubject.getDeferredEvents().length).toBe(1);
        expect(testSubject.getDeferredEvents()[0].eventType).toEqual(eventDetails.eventType);
        expect(testSubject.getDeferredEvents()[0].eventArgs).toStrictEqual(eventDetails.eventArgs);
        expect(testSubject.getDeferredEvents()[0].resolveDeferred).toBeDefined();

        validator.verifyAll();
    });
    it('processEvent does not duplicate deferred event if no listeners are available', () => {
        const testSubject = validator.buildBrowserAdapterEventManagerWithProperties({
            deferredEvents: [{ eventType: testEventType, eventArgs: testArgs }],
        });

        validator.setupPromiseFactory(0);

        testSubject.processEvent(testEventType, testArgs);
        expect(testSubject.getDeferredEvents().length).toBe(1);

        validator.verifyAll();
    });

    it('registerEventToApplicationListener processes deferred events for eventType', () => {
        const mockResolveDeferred = Mock.ofType<(eventDetails: EventDetails) => any>();
        mockResolveDeferred.setup(r => r(It.isAny())).verifiable(Times.once());
        const mockApplicationListener = validator.setupMockApplicationListener(testArgs, 0);
        const testSubject = validator.buildBrowserAdapterEventManagerWithProperties({
            deferredEvents: [
                {
                    eventType: testEventType,
                    eventArgs: testArgs,
                    resolveDeferred: mockResolveDeferred.object,
                },
                {
                    eventType: `${testEventType}-2`,
                    eventArgs: testArgs,
                    resolveDeferred: Mock.ofType<(eventDetails: EventDetails) => any>().object,
                },
            ],
        });
        testSubject.registerEventToApplicationListener(
            testEventType,
            mockApplicationListener.object,
        );
        expect(testSubject.getDeferredEvents().length).toBe(1);
        mockApplicationListener.verifyAll();
        mockResolveDeferred.verifyAll();
    });

    it('removeListener calls removeListener on eventAPI and removes listener from mapping with $typeName timeout', () => {
        const testSubject = validator.buildBrowserAdapterEventManagerWithProperties({
            eventsToApplicationListenersMapping: {
                [testEventType]: testApplicationListener,
            },
        });
        const mockAdapterListener = validator.setupAdapterListener(testEventType, testArgs, 1);
        validator.setTestSubjectProperties(testSubject, {
            adapterListener: mockAdapterListener.object,
        });
        const mockEventAPI = validator.setupMockEventAPIRemoveListener(testEventType, 1);
        testSubject.removeListener(mockEventAPI.object, testEventType);
        expect(testSubject.getEventsToApplicationListenersMapping()[testEventType]).toBeUndefined();
        validator.verifyAll();
        mockEventAPI.verifyAll();
    });
});

type BrowserAdapterEventManagerProperties = {
    deferredEvents?: EventDetails[];
    eventsToApplicationListenersMapping?: DictionaryStringTo<ApplicationListener>;
    adapterListener?: AdapterListener;
};
class BrowserAdapterEventManagerValidator {
    private mockPromiseFactory: IMock<PromiseFactory>;
    private mockAdapterListener: IMock<AdapterListener>;

    public buildBrowserAdapterEventManager(): TestableBrowserAdapterEventManager {
        this.mockPromiseFactory = Mock.ofType<PromiseFactory>();
        this.mockAdapterListener = Mock.ofType<AdapterListener>();

        return new TestableBrowserAdapterEventManager(this.mockPromiseFactory.object);
    }

    public buildBrowserAdapterEventManagerWithProperties(
        properties: BrowserAdapterEventManagerProperties,
    ): TestableBrowserAdapterEventManager {
        this.mockPromiseFactory = Mock.ofType<PromiseFactory>();
        this.mockAdapterListener = Mock.ofType<AdapterListener>();

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
                case 'adapterListener':
                    testSubject.setAdapterListener(properties[key]);
                    break;
            }
        });
        return testSubject;
    }

    public setupAdapterListener(eventType: string, eventArgs: any[], times: number) {
        this.mockAdapterListener.setup(a => a(eventType)).verifiable(Times.exactly(times + 1)); //this gets called when setting up mockEventAPI in addition to where it runs in the test

        return this.mockAdapterListener;
    }

    public setupMockEventAPIAddListener(eventType: string, times: number) {
        const mockEventAPI: IMock<Events.Event<any>> = Mock.ofType<Events.Event<any>>();
        mockEventAPI
            .setup(e => e.addListener(this.mockAdapterListener.object(eventType)))
            .verifiable(Times.exactly(times));
        return mockEventAPI;
    }

    public setupMockEventAPIRemoveListener(eventType: string, times: number) {
        const mockEventAPI: IMock<Events.Event<any>> = Mock.ofType<Events.Event<any>>();
        mockEventAPI
            .setup(e => e.removeListener(this.mockAdapterListener.object(eventType)))
            .verifiable(Times.exactly(times));
        return mockEventAPI;
    }

    public setupPromiseFactory(times: number): BrowserAdapterEventManagerValidator {
        this.mockPromiseFactory
            .setup(p => p.timeout(It.isAny(), It.isAnyNumber()))
            .verifiable(Times.exactly(times));

        return this;
    }

    public setupMockApplicationListener(listenerArgs: any[], times: number) {
        const mockApplicationListener: IMock<ApplicationListener> =
            Mock.ofType<ApplicationListener>();
        mockApplicationListener.setup(l => l(...listenerArgs)).verifiable(Times.exactly(times));
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

    public verifyAll(): void {
        this.mockPromiseFactory.verifyAll();
        this.mockAdapterListener.verifyAll();
    }

    public resetVerify(): void {
        this.mockPromiseFactory.reset();
        this.mockAdapterListener.reset();
    }
}
