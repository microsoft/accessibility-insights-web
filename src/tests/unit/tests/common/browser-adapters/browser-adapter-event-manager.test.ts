// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import {
    BrowserAdapterEventManager,
    ApplicationListener,
    EventDetails,
    AdapterListener,
} from 'common/browser-adapters/browser-adapter-event-manager';
import { PromiseFactory } from 'common/promises/promise-factory';
import {
    AlarmTimeoutFactory,
    TimeoutFactory,
    TimeoutType,
    WindowTimeoutFactory,
} from 'common/timeouts/timeout-factory';
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

    it.each`
        timeoutType           | typeName
        ${TimeoutType.Alarm}  | ${'alarm'}
        ${TimeoutType.Window} | ${'window'}
    `(
        'registerAdapterListenerForEvent adds adapter listener bound to eventType to eventAPI with $timeoutType timeout factory',
        timeoutType => {
            validator.setTimeoutType(timeoutType);
            const testSubject = validator.buildBrowserAdapterEventManager();
            const mockAdapterListener = validator.setupAdapterListener(testEventType, testArgs, 1);
            validator.setTestSubjectProperties(testSubject, {
                adapterListener: mockAdapterListener.object,
            });
            const mockEventAPI = validator.setupMockEventAPIAddListener(testEventType, 1);
            testSubject.registerAdapterListenerForEvent(mockEventAPI.object, testEventType);
            validator.verifyAll();
            mockEventAPI.verifyAll();
        },
    );
    it.each`
        timeoutType           | typeName
        ${TimeoutType.Alarm}  | ${'alarm'}
        ${TimeoutType.Window} | ${'window'}
    `(
        'registerEventToApplicationListener creates a new array of events if no events are found for eventType with $timeoutType timeout factory',
        timeoutType => {
            validator.setTimeoutType(timeoutType);
            const testSubject = validator.buildBrowserAdapterEventManager();
            expect(testSubject.getEventsToApplicationListenersMapping()[testEventType]).toBe(
                undefined,
            );
            testSubject.registerEventToApplicationListener(testEventType, testApplicationListener);
            expect(testSubject.getEventsToApplicationListenersMapping()[testEventType].length).toBe(
                1,
            );
            expect(
                testSubject.getEventsToApplicationListenersMapping()[testEventType],
            ).toStrictEqual([testApplicationListener]);
            validator.verifyAll();
        },
    );

    it.each`
        timeoutType           | typeName
        ${TimeoutType.Alarm}  | ${'alarm'}
        ${TimeoutType.Window} | ${'window'}
    `(
        'registerEventToApplicationListener adds to the event array of events if existing events are found for eventType with $timeoutType timeout factory',
        timeoutType => {
            validator.setTimeoutType(timeoutType);
            const testSubject = validator.buildBrowserAdapterEventManagerWithProperties({
                eventsToApplicationListenersMapping: {
                    [testEventType]: [testApplicationListener],
                },
            });
            testSubject.registerEventToApplicationListener(testEventType, testApplicationListener2);
            expect(testSubject.getEventsToApplicationListenersMapping()[testEventType].length).toBe(
                2,
            );
            expect(
                testSubject.getEventsToApplicationListenersMapping()[testEventType],
            ).toStrictEqual([testApplicationListener, testApplicationListener2]);
            validator.verifyAll();
        },
    );

    it.each`
        timeoutType           | typeName
        ${TimeoutType.Alarm}  | ${'alarm'}
        ${TimeoutType.Window} | ${'window'}
    `(
        'processEvent calls registered listener and starts timeout for non-promise results with $timeoutType timeout factory',
        timeoutType => {
            validator.setTimeoutType(timeoutType);
            const mockApplicationListener = validator.setupMockApplicationListener(testArgs, 1);
            const testSubject = validator.buildBrowserAdapterEventManagerWithProperties({
                eventsToApplicationListenersMapping: {
                    [testEventType]: [mockApplicationListener.object],
                },
            });
            validator.setupTimeoutFactory(1).setupPromiseFactory(0);
            testSubject.processEvent(testEventType, testArgs);
            validator.verifyAll();
            mockApplicationListener.verifyAll();
        },
    );
    it.each`
        timeoutType           | typeName
        ${TimeoutType.Alarm}  | ${'alarm'}
        ${TimeoutType.Window} | ${'window'}
    `(
        'processEvent passes multiple args through to registered listener with $timeoutType timeout factory',
        timeoutType => {
            validator.setTimeoutType(timeoutType);
            const multiArgs = ['a', 1, null];
            const mockApplicationListener = validator.setupMockApplicationListener(multiArgs, 1);
            const testSubject = validator.buildBrowserAdapterEventManagerWithProperties({
                eventsToApplicationListenersMapping: {
                    [testEventType]: [mockApplicationListener.object],
                },
            });
            validator.setupTimeoutFactory(1).setupPromiseFactory(0);
            testSubject.processEvent(testEventType, multiArgs);
            validator.verifyAll();
            mockApplicationListener.verifyAll();
        },
    );

    it.each`
        timeoutType           | typeName
        ${TimeoutType.Alarm}  | ${'alarm'}
        ${TimeoutType.Window} | ${'window'}
    `(
        'processEvent calls registered listener and starts promise race for promise results with $timeoutType timeout factory',
        timeoutType => {
            validator.setTimeoutType(timeoutType);
            const mockApplicationListener = validator.setupMockAsyncApplicationListener(
                testArgs,
                1,
            );
            const testSubject = validator.buildBrowserAdapterEventManagerWithProperties({
                eventsToApplicationListenersMapping: {
                    [testEventType]: [mockApplicationListener.object],
                },
            });
            validator.setupTimeoutFactory(0).setupPromiseFactory(1);
            testSubject.processEvent(testEventType, testArgs);
            validator.verifyAll();
            mockApplicationListener.verifyAll();
        },
    );
    it.each`
        timeoutType           | typeName
        ${TimeoutType.Alarm}  | ${'alarm'}
        ${TimeoutType.Window} | ${'window'}
    `(
        'processEvent calls all registered listeners if multiple are available with $timeoutType timeout factory',
        timeoutType => {
            validator.setTimeoutType(timeoutType);
            const mockApplicationListener = validator.setupMockApplicationListener(testArgs, 1);
            const mockApplicationListener2 = validator.setupMockApplicationListener(testArgs, 1);
            const testSubject = validator.buildBrowserAdapterEventManagerWithProperties({
                eventsToApplicationListenersMapping: {
                    [testEventType]: [
                        mockApplicationListener.object,
                        mockApplicationListener2.object,
                    ],
                },
            });
            validator.setupTimeoutFactory(2).setupPromiseFactory(0);
            testSubject.processEvent(testEventType, testArgs);
            validator.verifyAll();
            mockApplicationListener.verifyAll();
            mockApplicationListener2.verifyAll();
        },
    );

    it.each`
        timeoutType           | typeName
        ${TimeoutType.Alarm}  | ${'alarm'}
        ${TimeoutType.Window} | ${'window'}
    `(
        'processEvent defers event if no listeners are available with $timeoutType timeout factory',
        timeoutType => {
            validator.setTimeoutType(timeoutType);
            const testSubject = validator.buildBrowserAdapterEventManager();
            validator.setupTimeoutFactory(0).setupPromiseFactory(0);
            expect(testSubject.getDeferredEvents().length).toBe(0);
            testSubject.processEvent(testEventType, testArgs);
            expect(testSubject.getDeferredEvents().length).toBe(1);
            expect(testSubject.getDeferredEvents()[0]).toStrictEqual({
                eventType: testEventType,
                eventArgs: testArgs,
            });
            validator.verifyAll();
        },
    );
    it.each`
        timeoutType           | typeName
        ${TimeoutType.Alarm}  | ${'alarm'}
        ${TimeoutType.Window} | ${'window'}
    `(
        'processEvent does not defer event if no listeners are available but isDeferred is true with $timeoutType timeout factory',
        timeoutType => {
            validator.setTimeoutType(timeoutType);
            const testSubject = validator.buildBrowserAdapterEventManager();

            validator.setupTimeoutFactory(0).setupPromiseFactory(0);

            expect(testSubject.getDeferredEvents().length).toBe(0);
            testSubject.processEvent(testEventType, testArgs, true);
            validator.verifyAll();
        },
    );

    it.each`
        timeoutType           | typeName
        ${TimeoutType.Alarm}  | ${'alarm'}
        ${TimeoutType.Window} | ${'window'}
    `(
        'registerEventToApplicationListener processes deferred events for eventType with $timeoutType timeout factory',
        timeoutType => {
            validator.setTimeoutType(timeoutType);
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
        },
    );

    it.each`
        timeoutType           | typeName
        ${TimeoutType.Alarm}  | ${'alarm'}
        ${TimeoutType.Window} | ${'window'}
    `(
        'removeListener calls removeListener on eventAPI and removes listener from mapping with $typeName timeout',
        timeoutType => {
            validator.setTimeoutType(timeoutType);
            const testSubject = validator.buildBrowserAdapterEventManagerWithProperties({
                eventsToApplicationListenersMapping: {
                    [testEventType]: [testApplicationListener, testApplicationListener2],
                },
            });
            const mockAdapterListener = validator.setupAdapterListener(testEventType, testArgs, 1);
            validator.setTestSubjectProperties(testSubject, {
                adapterListener: mockAdapterListener.object,
            });
            const mockEventAPI = validator.setupMockEventAPIRemoveListener(testEventType, 1);
            testSubject.removeListener(mockEventAPI.object, testEventType, testApplicationListener);
            expect(testSubject.getEventsToApplicationListenersMapping()[testEventType].length).toBe(
                1,
            );
            expect(
                testSubject.getEventsToApplicationListenersMapping()[testEventType],
            ).toStrictEqual([testApplicationListener2]);
            validator.verifyAll();
            mockEventAPI.verifyAll();
            testSubject.removeListener(
                mockEventAPI.object,
                testEventType,
                testApplicationListener2,
            );
            expect(
                testSubject.getEventsToApplicationListenersMapping()[testEventType],
            ).toBeUndefined();
        },
    );
});

type BrowserAdapterEventManagerProperties = {
    deferredEvents?: EventDetails[];
    eventsToApplicationListenersMapping?: DictionaryStringTo<ApplicationListener[]>;
    adapterListener?: AdapterListener;
};
class BrowserAdapterEventManagerValidator {
    private mockPromiseFactory: IMock<PromiseFactory>;
    private mockTimeoutFactory: IMock<TimeoutFactory>;
    private mockAdapterListener: IMock<AdapterListener>;
    private timeoutType: TimeoutType;

    public setTimeoutType(timeoutType: TimeoutType) {
        this.timeoutType = timeoutType;
        return this;
    }
    public buildBrowserAdapterEventManager(): TestableBrowserAdapterEventManager {
        this.mockPromiseFactory = Mock.ofType<PromiseFactory>();
        this.mockTimeoutFactory =
            this.timeoutType === TimeoutType.Window
                ? Mock.ofType<WindowTimeoutFactory>()
                : Mock.ofType<AlarmTimeoutFactory>();
        this.mockAdapterListener = Mock.ofType<AdapterListener>();

        return new TestableBrowserAdapterEventManager(
            this.mockPromiseFactory.object,
            this.mockTimeoutFactory.object,
        );
    }

    public buildBrowserAdapterEventManagerWithProperties(
        properties: BrowserAdapterEventManagerProperties,
    ): TestableBrowserAdapterEventManager {
        this.mockPromiseFactory = Mock.ofType<PromiseFactory>();
        this.mockTimeoutFactory =
            this.timeoutType === TimeoutType.Window
                ? Mock.ofType<WindowTimeoutFactory>()
                : Mock.ofType<AlarmTimeoutFactory>();
        this.mockAdapterListener = Mock.ofType<AdapterListener>();

        const testSubject = new TestableBrowserAdapterEventManager(
            this.mockPromiseFactory.object,
            this.mockTimeoutFactory.object,
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

    public setupTimeoutFactory(times: number): BrowserAdapterEventManagerValidator {
        if (this.timeoutType === TimeoutType.Window) {
            this.mockTimeoutFactory
                .setup(t => t.createTimeout(itIsFunction, It.isAnyNumber()))
                .verifiable(Times.exactly(times));
            this.mockTimeoutFactory
                .setup(t => t.timeoutType)
                .returns(() => TimeoutType.Window)
                .verifiable(Times.exactly(times));
        } else {
            this.mockTimeoutFactory
                .setup(t => t.createTimeout(itIsFunction, It.isAnyNumber(), It.isAnyString()))
                .verifiable(Times.exactly(times));
            this.mockTimeoutFactory
                .setup(t => t.timeoutType)
                .returns(() => TimeoutType.Alarm)
                .verifiable(Times.exactly(times));
        }
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
        this.mockTimeoutFactory.verifyAll();
        this.mockAdapterListener.verifyAll();
    }

    public resetVerify(): void {
        this.mockPromiseFactory.reset();
        this.mockTimeoutFactory.reset();
        this.mockAdapterListener.reset();
    }
}
