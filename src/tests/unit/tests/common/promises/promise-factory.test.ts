// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    createDefaultPromiseFactory,
    ExternalResolutionPromise,
    TimeoutError,
} from 'common/promises/promise-factory';

function neverResolveAsync(): Promise<never> {
    return new Promise(() => {});
}

describe(`promiseFactory`, () => {
    const testObject = createDefaultPromiseFactory();
    describe('timeout', () => {
        it("propogates an underlying Promise's resolve", async () => {
            const actual = 'the result';
            const resolving = Promise.resolve(actual);

            const result = testObject.timeout(resolving, 10);

            await expect(result).resolves.toEqual(actual);
        });

        it("propogates an underlying Promise's reject", async () => {
            const reason = 'rejecting!';
            const rejecting = testObject.timeout(Promise.reject(reason), 10);

            await expect(rejecting).rejects.toEqual(reason);
        });

        it('rejects with a TimeoutError on timeout', async () => {
            const delay = 1;
            const timingOut = testObject.timeout(neverResolveAsync(), delay);

            await expect(timingOut).rejects.toThrowError(TimeoutError);
        });

        it(' rejects with the pinned error message on timeout', async () => {
            const delay = 1;
            const timingOut = testObject.timeout(neverResolveAsync(), delay);

            await expect(timingOut).rejects.toThrowErrorMatchingInlineSnapshot(
                `"Timed out after 1ms"`,
            );
        });
    });

    describe('delay', () => {
        it("propogates an underlying Promise's resolve", async () => {
            const actual = 'the result';
            const resolving = new Promise(resolve => {
                setTimeout(() => resolve(actual), 10);
            });

            const result = testObject.delay(resolving, 20);

            expect(result).resolves.toEqual(actual);
        });

        it("propogates an underlying Promise's reject", async () => {
            const reason = 'rejecting!';
            const rejecting = new Promise((resolve, reject) => {
                setTimeout(() => reject(reason), 10);
            });
            expect(rejecting).rejects.toEqual(reason);
        });

        it('resolves the pending promise if it times out', async () => {
            const timingOut = testObject.delay(neverResolveAsync(), 10);

            expect(timingOut).resolves.toBeCalled();
        });
    });

    describe('createPromiseForExternalResolution', () => {
        let promiseForExternalResolution: ExternalResolutionPromise;
        beforeEach(() => {
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
