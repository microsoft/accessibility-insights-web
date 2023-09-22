// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    createDefaultPromiseFactory,
    ExternalResolutionPromise,
    PromiseFactory,
    TimeoutError,
} from 'common/promises/promise-factory';

function neverResolveAsync(): Promise<never> {
    return new Promise(() => {});
}

describe(`promiseFactory`, () => {
    let testObject: PromiseFactory;

    describe('timeout', () => {
        beforeEach(() => {
            testObject = createDefaultPromiseFactory();
        });
        it("propagates an underlying Promise's resolve", async () => {
            const actual = 'the result';
            const resolving = Promise.resolve(actual);

            const result = testObject.timeout(resolving, 10);

            await expect(result).resolves.toEqual(actual);
        });

        it("propagates an underlying Promise's reject", async () => {
            const reason = 'rejecting!';
            const rejecting = testObject.timeout(Promise.reject(reason), 10);

            await expect(rejecting).rejects.toEqual(reason);
        });

        it('rejects with a TimeoutError on timeout', async () => {
            const delay = 1;
            const timingOut = testObject.timeout(neverResolveAsync(), delay);

            await expect(timingOut).rejects.toThrowError(TimeoutError);
        });

        it('rejects with the pinned error message on timeout', async () => {
            const delay = 1;
            const timingOut = testObject.timeout(neverResolveAsync(), delay);

            await expect(timingOut).rejects.toThrowErrorMatchingSnapshot();
        });

        it('rejects with the pinned error message on timeout with error context', async () => {
            const delay = 1;
            const timingOut = testObject.timeout(neverResolveAsync(), delay, 'test-error-context');

            await expect(timingOut).rejects.toThrowErrorMatchingSnapshot();
        });
    });

    describe('delay', () => {
        beforeEach(() => {
            testObject = createDefaultPromiseFactory();
        });
        it("propagates an underlying Promise's resolve", async () => {
            const actual = 'the result';
            const resolving = new Promise(resolve => {
                setTimeout(() => resolve(actual), 10);
            });

            const result = testObject.delay(resolving, 20);

            await expect(result).resolves.toEqual(actual);
        });

        it("resolves with an underlying Promise's reject", async () => {
            const reason = 'rejecting!';
            const rejecting = new Promise((resolve, reject) => {
                setTimeout(() => {
                    reject(reason);
                }, 10);
            }).catch(error => {
                //jest expects caught rejections
                expect(error).toEqual(reason);
                return reason;
            });
            const result = testObject.delay(rejecting, 20);
            await expect(result).resolves.toEqual(reason);
        });

        it('resolves the pending promise if it times out', async () => {
            const actual = 'the result';
            const resolving = new Promise(resolve => {
                setTimeout(() => resolve(actual), 1000);
            });
            const timingOut = testObject.delay(resolving, 10);
            await expect(timingOut).resolves.toStrictEqual(actual);
        });
    });

    describe('createPromiseForExternalResolution', () => {
        let promiseForExternalResolution: ExternalResolutionPromise;
        beforeEach(() => {
            testObject = createDefaultPromiseFactory();
            promiseForExternalResolution = testObject.externalResolutionPromise();
        });

        it('returns a promise for external resolution', () => {
            expect(promiseForExternalResolution.promise).toHaveProperty('then');
        });

        it('calling returned reject resolves the promise', async () => {
            promiseForExternalResolution.rejectHook('rejecting promise');
            await expect(promiseForExternalResolution.promise).rejects.toBe('rejecting promise');
        });

        it('calling returned resolve resolves the promise', async () => {
            promiseForExternalResolution.resolveHook('resolving promise');
            await expect(promiseForExternalResolution.promise).resolves.toBe('resolving promise');
        });
    });
});
