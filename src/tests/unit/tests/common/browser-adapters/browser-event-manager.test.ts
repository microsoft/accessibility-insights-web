// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    ApplicationListener,
    BrowserEventManager,
} from 'common/browser-adapters/browser-event-manager';
import {
    createDefaultPromiseFactory,
    PromiseFactory,
    TimeoutError,
} from 'common/promises/promise-factory';
import { RecordingLogger } from 'tests/unit/common/recording-logger';
import { SimulatedBrowserEvent } from 'tests/unit/common/simulated-browser-event';
import { TimeSimulatingPromiseFactory } from 'tests/unit/common/time-simulating-promise-factory';

describe(BrowserEventManager, () => {
    let realPromiseFactory: PromiseFactory;
    let timeSimulatingPromiseFactory: TimeSimulatingPromiseFactory;
    let recordingLogger: RecordingLogger;
    let testEvent: SimulatedBrowserEvent<(...args: string[]) => Promise<string>>;
    let testSubject: BrowserEventManager;

    beforeEach(() => {
        realPromiseFactory = createDefaultPromiseFactory();
        timeSimulatingPromiseFactory = new TimeSimulatingPromiseFactory();
        recordingLogger = new RecordingLogger();
        testEvent = new SimulatedBrowserEvent();
        testSubject = new BrowserEventManager(timeSimulatingPromiseFactory, recordingLogger);
    });

    it('delegates to pre-registered, Promise-based ApplicationListeners', async () => {
        testSubject.addBrowserListener(testEvent, 'event-type');
        testSubject.addApplicationListener('event-type', async () => 'app listener result');

        await expect(testEvent.invoke()).resolves.toBe('app listener result');
        expect(recordingLogger.allMessages).toStrictEqual([]);
        expect(timeSimulatingPromiseFactory.elapsedTime).toBe(0);
    });

    it('defers to a Promise-based ApplicationListener that registers after the event occurs', async () => {
        testSubject.addBrowserListener(testEvent, 'event-type');

        const promiseReturnedToEvent = testEvent.invoke();
        testSubject.addApplicationListener('event-type', async () => 'app listener result');
        await expect(promiseReturnedToEvent).resolves.toBe('app listener result');

        expect(recordingLogger.allMessages).toStrictEqual([]);
        expect(timeSimulatingPromiseFactory.elapsedTime).toBe(0);
    });

    it('continues deferring events past registration of unrelated event types', async () => {
        testSubject.addBrowserListener(testEvent, 'event-type');

        const promiseReturnedToEvent = testEvent.invoke();

        testSubject.addApplicationListener(
            'unrelated-event-type',
            async () => 'unrelated app listener result',
        );

        expect(recordingLogger.allMessages).toStrictEqual([]);
        expect(timeSimulatingPromiseFactory.elapsedTime).toBe(0);

        testSubject.addApplicationListener('event-type', async () => 'app listener result');
        await expect(promiseReturnedToEvent).resolves.toBe('app listener result');

        expect(recordingLogger.allMessages).toStrictEqual([]);
        expect(timeSimulatingPromiseFactory.elapsedTime).toBe(0);
    });

    it('can track multiple outstanding deferrals', async () => {
        testSubject.addBrowserListener(testEvent, 'event-type');

        const invokePromises = [testEvent.invoke(), testEvent.invoke(), testEvent.invoke()];

        let appListenerInvocations = 0;
        testSubject.addApplicationListener('event-type', async () => {
            return appListenerInvocations++;
        });

        await expect(Promise.all(invokePromises)).resolves.toStrictEqual([0, 1, 2]);
        expect(appListenerInvocations).toBe(3);
    });

    it('delegates to pre-registered, fire-and-forget ApplicationListeners with a 2 minute post-delay', async () => {
        testSubject.addBrowserListener(testEvent, 'event-type');

        let appListenerFired = false;
        testSubject.addApplicationListener('event-type', () => {
            appListenerFired = true;
        });

        const promiseReturnedToEvent = testEvent.invoke();

        // The synchronous app listener should fire before we start delaying
        expect(appListenerFired).toBe(true);
        expect(timeSimulatingPromiseFactory.elapsedTime).toBe(0);

        await expect(promiseReturnedToEvent).resolves.toBe(undefined);

        expect(timeSimulatingPromiseFactory.elapsedTime).toBe(0);
        expect(recordingLogger.allMessages).toStrictEqual([]);
    });

    it('honors fire and forget timeout override', async () => {
        testSubject = new BrowserEventManager(
            timeSimulatingPromiseFactory,
            recordingLogger,
            120000,
        );

        testSubject.addBrowserListener(testEvent, 'event-type');

        let appListenerFired = false;
        testSubject.addApplicationListener('event-type', () => {
            appListenerFired = true;
        });

        const promiseReturnedToEvent = testEvent.invoke();

        // The synchronous app listener should fire before we start delaying
        expect(appListenerFired).toBe(true);
        expect(timeSimulatingPromiseFactory.elapsedTime).toBe(0);

        await expect(promiseReturnedToEvent).resolves.toBe(undefined);

        expect(timeSimulatingPromiseFactory.elapsedTime).toBe(120000);
        expect(recordingLogger.allMessages).toStrictEqual([]);
    });

    it('delegates to post-registered, fire-and-forget ApplicationListeners with a 2 minute post-delay', async () => {
        // This test involves a 2 minute fire-and-forget delay and a 4-minute timeout racing each
        // other. This case is to test that the delay is present, so we make sure the delay wins
        // the race by forcing the timeout to take a nonzero amount of real time.
        timeSimulatingPromiseFactory.actualTimeoutMs = 1000;

        testSubject.addBrowserListener(testEvent, 'event-type');
        // event invoked before listener registered
        const promiseReturnedToEvent = testEvent.invoke();

        let appListenerFired = false;
        testSubject.addApplicationListener('event-type', () => {
            appListenerFired = true;
        });

        // The synchronous app listener should fire before we start delaying
        expect(appListenerFired).toBe(true);
        expect(timeSimulatingPromiseFactory.elapsedTime).toBe(0);

        await expect(promiseReturnedToEvent).resolves.toBe(undefined);

        expect(timeSimulatingPromiseFactory.elapsedTime).toBe(0);
        expect(recordingLogger.allMessages).toStrictEqual([]);
    });

    it('delegates to post-registered, fire-and-forget ApplicationListeners with a 4 minute timeout', async () => {
        // This test involves a 2 minute fire-and-forget delay and a 4-minute timeout racing each
        // other. This case is to test that the timeout is present, so we make sure the timeout wins
        // the race by forcing the delay to take a nonzero amount of real time.
        timeSimulatingPromiseFactory.actualDelayMs = 1000;

        testSubject.addBrowserListener(testEvent, 'event-type');
        // event invoked before listener registered
        const promiseReturnedToEvent = testEvent.invoke();

        let appListenerFired = false;
        testSubject.addApplicationListener('event-type', () => {
            appListenerFired = true;
        });

        // The synchronous app listener should fire before we start delaying
        expect(appListenerFired).toBe(true);
        expect(timeSimulatingPromiseFactory.elapsedTime).toBe(0);

        await expect(promiseReturnedToEvent).resolves.toBe(undefined);

        expect(timeSimulatingPromiseFactory.elapsedTime).toBe(240000);
        expect(recordingLogger.errorRecords).toHaveLength(1);
        expect(recordingLogger.errorRecords[0].message).toMatchInlineSnapshot(
            `"Error while processing browser event-type event: "`,
        );
        expect(recordingLogger.errorRecords[0].optionalParams[0]).toBeInstanceOf(TimeoutError);
    });

    it('times out after 4 minutes if no ApplicationListener registers in time', async () => {
        testSubject.addBrowserListener(testEvent, 'event-type');

        // This shouldn't reject, despite timing out; if it does, the browser might tear down the
        // whole Service Worker with other work still in progress.
        await expect(testEvent.invoke()).resolves.toBe(undefined);

        expect(timeSimulatingPromiseFactory.elapsedTime).toBe(240000);
        expect(recordingLogger.errorRecords).toHaveLength(1);
        expect(recordingLogger.errorRecords[0].message).toMatchInlineSnapshot(
            `"Error while processing browser event-type event: "`,
        );
        expect(recordingLogger.errorRecords[0].optionalParams[0]).toBeInstanceOf(TimeoutError);

        let appListenerFired = false;
        testSubject.addApplicationListener('event-type', () => {
            appListenerFired = true;
        });

        expect(appListenerFired).toBe(false);
    });

    it('times out late-registered Promise-based ApplicationListeners after 4 minutes', async () => {
        testSubject.addBrowserListener(testEvent, 'event-type');

        // Event invoked before app listener is registered
        const promiseReturnedToEvent = testEvent.invoke();

        const stalledAppListenerResponse = realPromiseFactory.externalResolutionPromise();
        testSubject.addApplicationListener('event-type', () => stalledAppListenerResponse.promise);
        await expect(promiseReturnedToEvent).resolves.toBe(undefined);

        expect(timeSimulatingPromiseFactory.elapsedTime).toBe(240000);
        expect(recordingLogger.errorRecords).toHaveLength(1);
        expect(recordingLogger.errorRecords[0].message).toMatchInlineSnapshot(
            `"Error while processing browser event-type event: "`,
        );
        expect(recordingLogger.errorRecords[0].optionalParams[0]).toBeInstanceOf(TimeoutError);

        stalledAppListenerResponse.resolveHook(null); // test cleanup, avoids Promise leak
    });

    it('times out pre-registered Promise-based ApplicationListeners after 4 minutes', async () => {
        testSubject.addBrowserListener(testEvent, 'event-type');

        // App listener registered before event invoked
        const stalledAppListenerResponse = realPromiseFactory.externalResolutionPromise();
        testSubject.addApplicationListener('event-type', () => stalledAppListenerResponse.promise);

        // This shouldn't reject, despite timing out; if it does, the browser might tear down the
        // whole Service Worker with other work still in progress.
        await expect(testEvent.invoke()).resolves.toBe(undefined);

        expect(timeSimulatingPromiseFactory.elapsedTime).toBe(240000);
        expect(recordingLogger.errorRecords).toHaveLength(1);
        expect(recordingLogger.errorRecords[0].message).toMatchInlineSnapshot(
            `"Error while processing browser event-type event: "`,
        );
        expect(recordingLogger.errorRecords[0].optionalParams[0]).toBeInstanceOf(TimeoutError);

        stalledAppListenerResponse.resolveHook(null); // test cleanup, avoids Promise leak
    });

    it('logs an error and propagates sync value-returning ApplicationListeners', async () => {
        const syncAppListener = (() => 'app listener result') as unknown as ApplicationListener;
        testSubject.addBrowserListener(testEvent, 'event-type');
        testSubject.addApplicationListener('event-type', syncAppListener);

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
        testSubject.addBrowserListener(testEvent, 'event-type');
        testSubject.addApplicationListener('event-type', () => {
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
        testSubject.addBrowserListener(testEvent, 'event-type');
        testSubject.addApplicationListener('event-type', async () => {
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
        testSubject.addApplicationListener('event-type', () => {});

        expect(() => {
            testSubject.addApplicationListener('event-type', () => {});
        }).toThrowErrorMatchingInlineSnapshot(`"Listener already registered for event-type"`);
    });

    describe('removeListener', () => {
        it('removes browser listeners', () => {
            testSubject.addBrowserListener(testEvent, 'event-type');
            expect(testEvent.hasListeners()).toBe(true);

            testSubject.removeListeners(testEvent, 'event-type');
            expect(testEvent.hasListeners()).toBe(false);
        });

        it('removes application listeners', async () => {
            testSubject.addBrowserListener(testEvent, 'event-type');
            testSubject.addApplicationListener('event-type', async () => 'app listener result');

            testSubject.removeListeners(testEvent, 'event-type');

            testSubject.addBrowserListener(testEvent, 'event-type');
            await expect(testEvent.invoke()).resolves.not.toBe('app listener result');
        });
    });
});
