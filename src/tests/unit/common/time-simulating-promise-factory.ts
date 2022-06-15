// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import {
    createDefaultPromiseFactory,
    ExternalResolutionPromise,
    PromiseFactory,
    TimeoutError,
} from 'common/promises/promise-factory';

// This is a testing version of PromiseFactory which simulates the passage of time for testing
// purposes. All timeouts and delays created with this factory finish after a single event loop
// tick (for test speed), but track the amount of "simulated" time that would have elapsed in
// theFactory.elapsedTime.
//
// To avoid confusing time manipulation by tests that leak promises, the factory intentionally
// does not provide a reset() method and should be considered single-use; you should create a new
// factory in a beforeEach for each test case.
export class TimeSimulatingPromiseFactory implements PromiseFactory {
    public elapsedTime: number = 0;
    public actualDelayMs: number = 0;
    public actualTimeoutMs: number = 0;

    constructor(
        private readonly realPromiseFactory: PromiseFactory = createDefaultPromiseFactory(),
    ) {}

    delay(result: any, delayInMs: number): Promise<any> {
        const startTime = this.elapsedTime;
        const externalResolution = this.realPromiseFactory.externalResolutionPromise();
        setTimeout(() => {
            this.elapsedTime = Math.max(startTime + delayInMs, this.elapsedTime);
            externalResolution.resolveHook(result);
        }, this.actualDelayMs);
        return externalResolution.promise;
    }

    externalResolutionPromise(): ExternalResolutionPromise {
        return this.realPromiseFactory.externalResolutionPromise();
    }

    timeout<T>(promise: Promise<T>, delayInMs: number, errorContext?: string): Promise<T> {
        const startTime = this.elapsedTime;
        return this.realPromiseFactory
            .timeout(promise, this.actualTimeoutMs, errorContext)
            .catch(async e => {
                if (e instanceof TimeoutError) {
                    this.elapsedTime = Math.max(startTime + delayInMs, this.elapsedTime);
                }
                throw e;
            });
    }
}
