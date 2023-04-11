// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

// This class handles the coordination between an "old" worker and a "new" worker when an
// extension upgrade occurs (including when the dev extension is rebuilt without reloading).
// Chromium will start the new worker *concurrently* with the old one in that case. The intent is
// for the new worker to end up in an "installed" (but not "activated" state), for the old worker
// (in an "activated" state) to continue to service requests for any pre-exisiting clients, and
// for the old worker to only get cleaned up once all connected clients close, at which point the
// new worker can "activate".
//
// This doesn't cooperate well with our architecture, which generally assumes that background
// lifetime works more like how background pages worked before Chromium switched to service workers,
// where only one background instance exists at a time. The most obvious issue this causes is when
// messages from clients to workers appear to get lost due to both workers trying to process them
// and only one succeeding, which tends to result in all of our UI getting stuck in loading spinners
// as initial store state messages get lost. A more serious issue is that the two worker instances
// risk stomping on each other's persisted state if they're both responding to client messages
// simultaneously.
export class ServiceWorkerActivator {
    private activatedPromise: Promise<void>;

    // This registers a service worker event handler, so it must be constructed during the sync
    // portion of service worker initialization.
    constructor(private readonly serviceWorkerGlobalScope: ServiceWorkerGlobalScope) {
        this.activatedPromise = new Promise(resolve => {
            serviceWorkerGlobalScope.addEventListener('activate', () => resolve());
        });
    }

    public async claimExistingServiceWorkerClients() {
        if (this.serviceWorkerGlobalScope.serviceWorker.state !== 'activated') {
            console.debug('New service worker version detected, forcing activation');
            // This tells the browser to move this worker from the "installed" state to the
            // "activated" state without waiting for existing clients to close.
            await this.serviceWorkerGlobalScope.skipWaiting();
            await this.activatedPromise;
        }

        // This tells existing clients to disconnect from any old worker instance and reconnect to
        // this one. It will throw an error if called from outside the "activated" state.
        await this.serviceWorkerGlobalScope.clients.claim();
    }
}
