// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ServiceWorkerActivator } from 'background/service-worker-activator';

describe(ServiceWorkerActivator, () => {
    let simulatedGlobalScope: ServiceWorkerGlobalScope;
    let activateCallback: Function | null;
    let testSubject: ServiceWorkerActivator;

    let claimFn: jest.Mock<Promise<void>>;
    let skipWaitingFn: jest.Mock<Promise<void>>;

    beforeEach(() => {
        claimFn = jest.fn(() => Promise.resolve());
        skipWaitingFn = jest.fn(() => Promise.resolve());

        activateCallback = null;
        simulatedGlobalScope = {
            addEventListener: (eventName, cb) => {
                expect(eventName).toBe('activate');
                activateCallback = cb;
            },
            clients: {
                claim: claimFn as () => Promise<void>,
            } as Clients,
            serviceWorker: {
                state: 'activated',
            },
            skipWaiting: skipWaitingFn as () => Promise<void>,
        } as ServiceWorkerGlobalScope;

        testSubject = new ServiceWorkerActivator(simulatedGlobalScope);
    });

    describe('constructor', () => {
        it('registers an activate listener synchronously', () => {
            expect(activateCallback).not.toBeNull();
        });
    });

    describe('claimExistingServiceWorkerClients', () => {
        it('always claims existing service worker clients', async () => {
            await testSubject.claimExistingServiceWorkerClients();

            expect(claimFn).toHaveBeenCalledTimes(1);
        });

        it('forces a transition to the "activated" state if necessary', async () => {
            (simulatedGlobalScope.serviceWorker.state as any) = 'installed';
            const claimPromise = testSubject.claimExistingServiceWorkerClients();

            activateCallback();

            await claimPromise;

            expect(skipWaitingFn).toHaveBeenCalledTimes(1);
            expect(claimFn).toHaveBeenCalledTimes(1);
        });

        it('does not wait for an "activate" event if already in the "activated" state', async () => {
            (simulatedGlobalScope.serviceWorker.state as any) = 'activated';
            await testSubject.claimExistingServiceWorkerClients();

            // intentionally not invoking activateCallback();

            expect(skipWaitingFn).not.toHaveBeenCalled();
        });
    });
});
