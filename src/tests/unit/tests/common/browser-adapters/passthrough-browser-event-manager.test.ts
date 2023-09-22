// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { PassthroughBrowserEventManager } from 'common/browser-adapters/passthrough-browser-event-manager';
import { SimulatedBrowserEvent } from 'tests/unit/common/simulated-browser-event';

describe(PassthroughBrowserEventManager, () => {
    let testEvent: SimulatedBrowserEvent<(...args: string[]) => Promise<string>>;
    let testSubject: PassthroughBrowserEventManager;

    beforeEach(() => {
        testEvent = new SimulatedBrowserEvent();
        testSubject = new PassthroughBrowserEventManager();
    });

    describe('addApplicationListener', () => {
        it('adds listeners directly to the underlying event', async () => {
            testSubject.addApplicationListener(
                'event-type',
                testEvent,
                async () => 'app listener result',
            );

            await expect(testEvent.invoke()).resolves.toBe('app listener result');
        });

        it('does not allow multiple registrations for the same event type', () => {
            testSubject.addApplicationListener('event-type', testEvent, () => {});

            expect(() => {
                testSubject.addApplicationListener('event-type', testEvent, () => {});
            }).toThrowErrorMatchingSnapshot();
        });
    });

    describe('removeListener', () => {
        it('removes previously registered application listener', async () => {
            testSubject.addApplicationListener(
                'event-type',
                testEvent,
                async () => 'app listener result',
            );

            testSubject.removeListeners('event-type', testEvent);

            await expect(testEvent.hasListeners()).toBe(false);
        });
    });
});
