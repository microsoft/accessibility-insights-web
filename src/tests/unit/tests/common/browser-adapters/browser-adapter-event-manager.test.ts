// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { SetTimeoutManager } from 'background/set-timeout-manager';
import {
    BrowserAdapterEventManager,
    ApplicationListener,
    EventDetails,
    AdapterListener,
} from 'common/browser-adapters/browser-adapter-event-manager';
import { PromiseFactory } from 'common/promises/promise-factory';
import { itIsFunction } from 'tests/unit/common/it-is-function';
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
        mapping: DictionaryStringTo<ApplicationListener[]>,
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
    const testApplicationListener2 = (count: number) => count;

    beforeEach(() => {
        validator = new BrowserAdapterEventManagerValidator();
    });

    it('registerAdapterListenerForEvent adds adapter listener bound to eventType to eventAPI', () => {
        const testSubject = validator.buildBrowserAdapterEventManager();
        const mockAdapterListener = validator.setupAdapterListener(testEventType, testArgs, 1);
        validator.setTestSubjectProperties(testSubject, {
            adapterListener: mockAdapterListener.object,
        });
        const mockEventAPI = validator.setupMockEventAPI(testEventType, 1);
        testSubject.registerAdapterListenerForEvent(mockEventAPI.object, testEventType);
        validator.verifyAll();
        mockEventAPI.verifyAll();
    });

    it('registerEventToApplicationListener creates a new array of events if no events are found for eventType', () => {
        const testSubject = validator.buildBrowserAdapterEventManager();
        expect(testSubject.getEventsToApplicationListenersMapping()[testEventType]).toBe(undefined);
        testSubject.registerEventToApplicationListener(testEventType, testApplicationListener);
        expect(testSubject.getEventsToApplicationListenersMapping()[testEventType].length).toBe(1);
        expect(testSubject.getEventsToApplicationListenersMapping()[testEventType]).toStrictEqual([
            testApplicationListener,
        ]);
        validator.verifyAll();
    });

    it('registerEventToApplicationListener adds to the event array of events if existing events are found for eventType', () => {
        const testSubject = validator.buildBrowserAdapterEventManagerWithProperties({
            eventsToApplicationListenersMapping: {
                [testEventType]: [testApplicationListener],
            },
        });
        testSubject.registerEventToApplicationListener(testEventType, testApplicationListener2);
        expect(testSubject.getEventsToApplicationListenersMapping()[testEventType].length).toBe(2);
        expect(testSubject.getEventsToApplicationListenersMapping()[testEventType]).toStrictEqual([
            testApplicationListener,
            testApplicationListener2,
        ]);
        validator.verifyAll();
    });

    it('processEvent calls registered listener and starts timeout for non-promise results', () => {
        const mockApplicationListener = validator.setupMockApplicationListener(testArgs, 1);
        const testSubject = validator.buildBrowserAdapterEventManagerWithProperties({
            eventsToApplicationListenersMapping: {
                [testEventType]: [mockApplicationListener.object],
            },
        });
        validator.setupSetTimeoutManager(1).setupPromiseFactory(0);
        testSubject.processEvent(testEventType, testArgs);
        validator.verifyAll();
        mockApplicationListener.verifyAll();
    });

    it('processEvent passes multiple args through to registered listener', () => {
        const multiArgs = ['a', 1, null];
        const mockApplicationListener = validator.setupMockApplicationListener(multiArgs, 1);
        const testSubject = validator.buildBrowserAdapterEventManagerWithProperties({
            eventsToApplicationListenersMapping: {
                [testEventType]: [mockApplicationListener.object],
            },
        });
        validator.setupSetTimeoutManager(1).setupPromiseFactory(0);
        testSubject.processEvent(testEventType, multiArgs);
        validator.verifyAll();
        mockApplicationListener.verifyAll();
    });

    it('processEvent calls registered listener and starts promise race for promise results', () => {
        const mockApplicationListener = validator.setupMockAsyncApplicationListener(testArgs, 1);
        const testSubject = validator.buildBrowserAdapterEventManagerWithProperties({
            eventsToApplicationListenersMapping: {
                [testEventType]: [mockApplicationListener.object],
            },
        });
        validator.setupSetTimeoutManager(0).setupPromiseFactory(1);
        testSubject.processEvent(testEventType, testArgs);
        validator.verifyAll();
        mockApplicationListener.verifyAll();
    });

    it('processEvent calls all registered listeners if multiple are available', () => {
        const mockApplicationListener = validator.setupMockApplicationListener(testArgs, 1);
        const mockApplicationListener2 = validator.setupMockApplicationListener(testArgs, 1);
        const testSubject = validator.buildBrowserAdapterEventManagerWithProperties({
            eventsToApplicationListenersMapping: {
                [testEventType]: [mockApplicationListener.object, mockApplicationListener2.object],
            },
        });
        validator.setupSetTimeoutManager(2).setupPromiseFactory(0);
        testSubject.processEvent(testEventType, testArgs);
        validator.verifyAll();
        mockApplicationListener.verifyAll();
        mockApplicationListener2.verifyAll();
    });

    it('processEvent defers event if no listeners are available', () => {
        const testSubject = validator.buildBrowserAdapterEventManager();
        validator.setupSetTimeoutManager(0).setupPromiseFactory(0);
        expect(testSubject.getDeferredEvents().length).toBe(0);
        testSubject.processEvent(testEventType, testArgs);
        expect(testSubject.getDeferredEvents().length).toBe(1);
        expect(testSubject.getDeferredEvents()[0]).toStrictEqual({
            eventType: testEventType,
            eventArgs: testArgs,
        });
        validator.verifyAll();
    });

    it('processEvent does not defer event if no listeners are available but isDeferred is true', () => {
        const testSubject = validator.buildBrowserAdapterEventManager();

        validator.setupSetTimeoutManager(0).setupPromiseFactory(0);

        expect(testSubject.getDeferredEvents().length).toBe(0);
        testSubject.processEvent(testEventType, testArgs, true);
        validator.verifyAll();
    });

    it('registerEventToApplicationListener processes deferred events for eventType', () => {
        const mockApplicationListener = validator.setupMockApplicationListener(testArgs, 2);
        const testSubject = validator.buildBrowserAdapterEventManagerWithProperties({
            deferredEvents: [
                { eventType: testEventType, eventArgs: testArgs },
                { eventType: testEventType, eventArgs: testArgs },
                { eventType: `${testEventType}-2`, eventArgs: testArgs },
            ],
        });
        testSubject.registerEventToApplicationListener(
            testEventType,
            mockApplicationListener.object,
        );
        expect(testSubject.getDeferredEvents().length).toBe(1);
        mockApplicationListener.verifyAll();
    });
});

type BrowserAdapterEventManagerProperties = {
    deferredEvents?: EventDetails[];
    eventsToApplicationListenersMapping?: DictionaryStringTo<ApplicationListener[]>;
    adapterListener?: AdapterListener;
};
class BrowserAdapterEventManagerValidator {
    private mockPromiseFactory: IMock<PromiseFactory>;
    private mockSetTimeoutManager: IMock<SetTimeoutManager>;
    private mockAdapterListener: IMock<AdapterListener>;

    constructor() {}

    public buildBrowserAdapterEventManager(): TestableBrowserAdapterEventManager {
        this.mockPromiseFactory = Mock.ofType<PromiseFactory>();
        this.mockSetTimeoutManager = Mock.ofType<SetTimeoutManager>();
        this.mockAdapterListener = Mock.ofType<AdapterListener>();

        return new TestableBrowserAdapterEventManager(
            this.mockPromiseFactory.object,
            this.mockSetTimeoutManager.object,
        );
    }

    public buildBrowserAdapterEventManagerWithProperties(
        properties: BrowserAdapterEventManagerProperties,
    ): TestableBrowserAdapterEventManager {
        this.mockPromiseFactory = Mock.ofType<PromiseFactory>();
        this.mockSetTimeoutManager = Mock.ofType<SetTimeoutManager>();
        this.mockAdapterListener = Mock.ofType<AdapterListener>();

        const testSubject = new TestableBrowserAdapterEventManager(
            this.mockPromiseFactory.object,
            this.mockSetTimeoutManager.object,
        );

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

    public setupMockEventAPI(eventType: string, times: number) {
        const mockEventAPI: IMock<Events.Event<any>> = Mock.ofType<Events.Event<any>>();
        mockEventAPI
            .setup(e => e.addListener(this.mockAdapterListener.object(eventType)))
            .verifiable(Times.exactly(times));
        return mockEventAPI;
    }

    public setupPromiseFactory(times: number): BrowserAdapterEventManagerValidator {
        this.mockPromiseFactory
            .setup(p => p.timeout(It.isAny(), It.isAnyNumber()))
            .verifiable(Times.exactly(times));

        return this;
    }

    public setupSetTimeoutManager(times: number): BrowserAdapterEventManagerValidator {
        this.mockSetTimeoutManager
            .setup(t => t.setTimeout(itIsFunction, It.isAnyNumber(), It.isAnyString()))
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
        this.mockSetTimeoutManager.verifyAll();
        this.mockAdapterListener.verifyAll();
    }

    public resetVerify(): void {
        this.mockPromiseFactory.reset();
        this.mockSetTimeoutManager.reset();
        this.mockAdapterListener.reset();
    }
}
