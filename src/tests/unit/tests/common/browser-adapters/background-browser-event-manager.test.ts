// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BackgroundBrowserEventManager } from 'common/browser-adapters/background-browser-event-manager';
import { ApplicationListener } from 'common/browser-adapters/browser-event-manager';
import { EventResponseFactory } from 'common/browser-adapters/event-response-factory';
import {
    createDefaultPromiseFactory,
    PromiseFactory,
    TimeoutError,
} from 'common/promises/promise-factory';
import { RecordingLogger } from 'tests/unit/common/recording-logger';
import { SimulatedBrowserEvent } from 'tests/unit/common/simulated-browser-event';
import { TimeSimulatingPromiseFactory } from 'tests/unit/common/time-simulating-promise-factory';

describe(BackgroundBrowserEventManager, () => {
    let realPromiseFactory: PromiseFactory;
    let timeSimulatingPromiseFactory: TimeSimulatingPromiseFactory;
    let eventResponseFactory: EventResponseFactory;
    let recordingLogger: RecordingLogger;
    let testEvent: SimulatedBrowserEvent<(...args: string[]) => Promise<string>>;
    let testSubject: BackgroundBrowserEventManager;

    beforeEach(() => {
        realPromiseFactory = createDefaultPromiseFactory();
        timeSimulatingPromiseFactory = new TimeSimulatingPromiseFactory();
        recordingLogger = new RecordingLogger();
        testEvent = new SimulatedBrowserEvent();
        eventResponseFactory = new EventResponseFactory(timeSimulatingPromiseFactory);
        testSubject = new BackgroundBrowserEventManager(
            timeSimulatingPromiseFactory,
            eventResponseFactory,
            recordingLogger,
        );
    });

    it('delegates to pre-registered, Promise-based ApplicationListeners', async () => {
        testSubject.preregisterBrowserListeners({ 'event-type': testEvent });
        testSubject.addApplicationListener(
            'event-type',
            testEvent,
            async () => 'app listener result',
        );

        await expect(testEvent.invoke()).resolves.toBe('app listener result');
        expect(recordingLogger.allMessages).toStrictEqual([]);
        expect(timeSimulatingPromiseFactory.elapsedTime).toBe(0);
    });

    it('defers to a Promise-based ApplicationListener that registers after the event occurs', async () => {
        testSubject.preregisterBrowserListeners({ 'event-type': testEvent });

        const promiseReturnedToEvent = testEvent.invoke();
        testSubject.addApplicationListener(
            'event-type',
            testEvent,
            async () => 'app listener result',
        );
        await expect(promiseReturnedToEvent).resolves.toBe('app listener result');

        expect(recordingLogger.allMessages).toStrictEqual([]);
        expect(timeSimulatingPromiseFactory.elapsedTime).toBe(0);
    });

    it('continues deferring events past registration of unrelated event types', async () => {
        const unrelatedBrowserEvent = new SimulatedBrowserEvent();
        testSubject.preregisterBrowserListeners({
            'event-type': testEvent,
            'unrelated-event-type': unrelatedBrowserEvent,
        });

        const promiseReturnedToEvent = testEvent.invoke();

        testSubject.addApplicationListener(
            'unrelated-event-type',
            unrelatedBrowserEvent,
            async () => 'unrelated app listener result',
        );

        expect(recordingLogger.allMessages).toStrictEqual([]);
        expect(timeSimulatingPromiseFactory.elapsedTime).toBe(0);

        testSubject.addApplicationListener(
            'event-type',
            testEvent,
            async () => 'app listener result',
        );
        await expect(promiseReturnedToEvent).resolves.toBe('app listener result');

        expect(recordingLogger.allMessages).toStrictEqual([]);
        expect(timeSimulatingPromiseFactory.elapsedTime).toBe(0);
    });

    it('can track multiple outstanding deferrals', async () => {
        testSubject.preregisterBrowserListeners({ 'event-type': testEvent });

        const invokePromises = [testEvent.invoke(), testEvent.invoke(), testEvent.invoke()];

        let appListenerInvocations = 0;
        testSubject.addApplicationListener('event-type', testEvent, async () => {
            return appListenerInvocations++;
        });

        await expect(Promise.all(invokePromises)).resolves.toStrictEqual([0, 1, 2]);
        expect(appListenerInvocations).toBe(3);
    });

    it('delegates to pre-registered, synchronous ApplicationListeners', async () => {
        testSubject.preregisterBrowserListeners({ 'event-type': testEvent });

        let appListenerFired = false;
        testSubject.addApplicationListener('event-type', testEvent, () => {
            appListenerFired = true;
        });

        const promiseReturnedToEvent = testEvent.invoke();

        expect(appListenerFired).toBe(true);
        await expect(promiseReturnedToEvent).resolves.toBe(undefined);
        expect(timeSimulatingPromiseFactory.elapsedTime).toBe(0);
        expect(recordingLogger.allMessages).toStrictEqual([]);
    });

    it('delegates to post-registered, synchronous ApplicationListeners', async () => {
        // This test involves a synchronous listener and an event timeout racing each
        // other. In this case, we make sure the listener wins the race by forcing
        // the timeout to take a nonzero amount of real time.
        timeSimulatingPromiseFactory.actualTimeoutMs = 1000;

        testSubject.preregisterBrowserListeners({ 'event-type': testEvent });
        // event invoked before listener registered
        const promiseReturnedToEvent = testEvent.invoke();

        let appListenerFired = false;
        testSubject.addApplicationListener('event-type', testEvent, () => {
            appListenerFired = true;
        });

        expect(appListenerFired).toBe(true);
        await expect(promiseReturnedToEvent).resolves.toBe(undefined);
        expect(recordingLogger.allMessages).toStrictEqual([]);
        expect(timeSimulatingPromiseFactory.elapsedTime).toBe(0);
    });

    it('times out if no ApplicationListener registers in time', async () => {
        testSubject.preregisterBrowserListeners({ 'event-type': testEvent });

        // This shouldn't reject, despite timing out; if it does, the browser might tear down the
        // whole Service Worker with other work still in progress.
        await expect(testEvent.invoke()).resolves.toBe(undefined);

        expect(timeSimulatingPromiseFactory.elapsedTime).toBe(60000);
        expect(recordingLogger.errorRecords).toHaveLength(1);
        expect(recordingLogger.errorRecords[0].message).toMatchInlineSnapshot(
            `"Error while processing browser event-type event: "`,
        );
        const loggedError = recordingLogger.errorRecords[0].optionalParams[0];
        expect(loggedError).toBeInstanceOf(TimeoutError);
        expect(loggedError.context).toMatchInlineSnapshot(
            `"[deferred browser event: {"eventType":"event-type","eventArgs":[]}]"`,
        );

        let appListenerFired = false;
        testSubject.addApplicationListener('event-type', testEvent, () => {
            appListenerFired = true;
        });

        expect(appListenerFired).toBe(false);
    });

    it('times out late-registered Promise-based ApplicationListeners', async () => {
        testSubject.preregisterBrowserListeners({ 'event-type': testEvent });

        // Event invoked before app listener is registered
        const promiseReturnedToEvent = testEvent.invoke();

        const stalledAppListenerResponse = realPromiseFactory.externalResolutionPromise();
        testSubject.addApplicationListener(
            'event-type',
            testEvent,
            () => stalledAppListenerResponse.promise,
        );
        await expect(promiseReturnedToEvent).resolves.toBe(undefined);

        expect(timeSimulatingPromiseFactory.elapsedTime).toBe(60000);
        expect(recordingLogger.errorRecords).toHaveLength(1);
        expect(recordingLogger.errorRecords[0].message).toMatchInlineSnapshot(
            `"Error while processing browser event-type event: "`,
        );
        const loggedError = recordingLogger.errorRecords[0].optionalParams[0];
        expect(loggedError).toBeInstanceOf(TimeoutError);
        expect(loggedError.context).toMatchInlineSnapshot(
            `"[deferred browser event: {"eventType":"event-type","eventArgs":[]}]"`,
        );

        stalledAppListenerResponse.resolveHook(null); // test cleanup, avoids Promise leak
    });

    it('times out pre-registered Promise-based ApplicationListeners', async () => {
        testSubject.preregisterBrowserListeners({ 'event-type': testEvent });

        // App listener registered before event invoked
        const stalledAppListenerResponse = realPromiseFactory.externalResolutionPromise();
        testSubject.addApplicationListener(
            'event-type',
            testEvent,
            () => stalledAppListenerResponse.promise,
        );

        // This shouldn't reject, despite timing out; if it does, the browser might tear down the
        // whole Service Worker with other work still in progress.
        await expect(testEvent.invoke()).resolves.toBe(undefined);

        expect(timeSimulatingPromiseFactory.elapsedTime).toBe(60000);
        expect(recordingLogger.errorRecords).toHaveLength(1);
        expect(recordingLogger.errorRecords[0].message).toMatchInlineSnapshot(
            `"Error while processing browser event-type event: "`,
        );
        const loggedError = recordingLogger.errorRecords[0].optionalParams[0];
        expect(loggedError).toBeInstanceOf(TimeoutError);
        expect(loggedError.context).toMatchInlineSnapshot(
            `"[browser event listener: {"eventType":"event-type","eventArgs":[]}]"`,
        );

        stalledAppListenerResponse.resolveHook(null); // test cleanup, avoids Promise leak
    });

    it('logs an error and propagates sync value-returning ApplicationListeners', async () => {
        const syncAppListener = (() => 'app listener result') as unknown as ApplicationListener;
        testSubject.preregisterBrowserListeners({ 'event-type': testEvent });
        testSubject.addApplicationListener('event-type', testEvent, syncAppListener);

        await expect(testEvent.invoke('event-arg-1', 'event-arg-2')).resolves.toBe(
            'app listener result',
        );

        expect(timeSimulatingPromiseFactory.elapsedTime).toBe(0);
        expect(recordingLogger.errorRecords).toHaveLength(1);
        expect(recordingLogger.errorRecords[0].message).toMatchInlineSnapshot(
            `"Unexpected sync ApplicationListener for browser event-type event: "`,
        );
        expect(recordingLogger.errorRecords[0].optionalParams[0]).toBe(syncAppListener);
        expect(recordingLogger.errorRecords[0].optionalParams[1]).toStrictEqual([
            'event-arg-1',
            'event-arg-2',
        ]);
    });

    it('logs and eats an error for throwing ApplicationListeners', async () => {
        const appListenerError = new Error('from app listener');
        testSubject.preregisterBrowserListeners({ 'event-type': testEvent });
        testSubject.addApplicationListener('event-type', testEvent, () => {
            throw appListenerError;
        });

        await expect(testEvent.invoke()).resolves.toBe(undefined);

        expect(timeSimulatingPromiseFactory.elapsedTime).toBe(0);
        expect(recordingLogger.errorRecords).toHaveLength(1);
        expect(recordingLogger.errorRecords[0].message).toMatchInlineSnapshot(
            `"Error thrown from ApplicationListener for browser event-type event: "`,
        );
        expect(recordingLogger.errorRecords[0].optionalParams[0]).toBe(appListenerError);
    });

    it('logs and eats an error for Promise-based ApplicationListeners which reject', async () => {
        const appListenerError = new Error('from app listener');
        testSubject.preregisterBrowserListeners({ 'event-type': testEvent });
        testSubject.addApplicationListener('event-type', testEvent, async () => {
            throw appListenerError;
        });

        await expect(testEvent.invoke()).resolves.toBe(undefined);

        expect(timeSimulatingPromiseFactory.elapsedTime).toBe(0);
        expect(recordingLogger.errorRecords).toHaveLength(1);
        expect(recordingLogger.errorRecords[0].message).toMatchInlineSnapshot(
            `"Error while processing browser event-type event: "`,
        );
        expect(recordingLogger.errorRecords[0].optionalParams[0]).toBe(appListenerError);
    });

    it('does not allow multiple registrations for the same event type', () => {
        testSubject.preregisterBrowserListeners({ 'event-type': testEvent });
        testSubject.addApplicationListener('event-type', testEvent, () => {});

        expect(() => {
            testSubject.addApplicationListener('event-type', testEvent, () => {});
        }).toThrowErrorMatchingInlineSnapshot(`"Listener already registered for event-type"`);
    });

    it('does not allow ApplicationListener added for an event that does not have a browser listener', async () => {
        expect(() => {
            testSubject.addApplicationListener(
                'event-type',
                testEvent,
                async () => 'app listener result',
            );
        }).toThrowErrorMatchingInlineSnapshot(
            `"No browser listener was pre-registered for event-type"`,
        );
    });

    describe('removeListener', () => {
        it('removes browser listeners', () => {
            testSubject.preregisterBrowserListeners({ 'event-type': testEvent });
            expect(testEvent.hasListeners()).toBe(true);

            testSubject.removeListeners('event-type', testEvent);
            expect(testEvent.hasListeners()).toBe(false);
        });

        it('removes application listeners', async () => {
            testSubject.preregisterBrowserListeners({ 'event-type': testEvent });
            testSubject.addApplicationListener(
                'event-type',
                testEvent,
                async () => 'app listener result',
            );

            testSubject.removeListeners('event-type', testEvent);

            testSubject.preregisterBrowserListeners({ 'event-type': testEvent });
            await expect(testEvent.invoke()).resolves.not.toBe('app listener result');
        });
    });
});
