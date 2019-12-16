// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { createDefaultPromiseFactory } from '../../../../../common/promises/promise-factory';

// wrote the test following examples from https://jestjs.io/docs/en/tutorial-async
describe('PromiseFactory', () => {
    const testObject = createDefaultPromiseFactory();

    describe('timeout', () => {
        it('resolves', () => {
            expect.assertions(1);

            const actual = 'the result';
            const resolving = Promise.resolve(actual);

            const result = testObject.timeout(resolving, 10);

            return expect(result).resolves.toEqual(actual);
        });

        it('rejects', () => {
            expect.assertions(1);

            const reason = 'rejecting!';
            const rejecting = testObject.timeout(Promise.reject(reason), 10);

            return expect(rejecting).rejects.toEqual(reason);
        });

        it('times out', () => {
            expect.assertions(1);

            const notResolving = new Promise(() => {
                /* never actually resolve, so it will timeout*/
            });

            const delay = 1;

            const timingOut = testObject.timeout(notResolving, delay);

            return expect(timingOut).rejects.toMatchSnapshot();
        });
    });

    describe('poll', () => {
        it('calls the predicate repeatedly until it returns true', async () => {
            const opts = { timeoutInMilliseconds: 100, pollIntervalInMilliseconds: 1 };
            let tries = 0;
            await testObject.poll(async () => (tries += 1) >= 5, opts);
            expect(tries).toBe(5);
        });

        it('resolves without any polling delay if predicate starts out true', async () => {
            const opts = { timeoutInMilliseconds: 9999999, pollIntervalInMilliseconds: 9999999 };

            // should resolve before the test times out
            await testObject.poll(() => Promise.resolve(true), opts);
        });

        it('times out if the predicate does not become true', async () => {
            const opts = { timeoutInMilliseconds: 10, pollIntervalInMilliseconds: 1 };
            await expect(testObject.poll(() => Promise.resolve(false), opts)).rejects.toMatchSnapshot();
        });

        it('propagates rejection from predicate promise', async () => {
            const opts = { timeoutInMilliseconds: 1000, pollIntervalInMilliseconds: 1 };
            await expect(testObject.poll(() => Promise.reject('reason'), opts)).rejects.toEqual('reason');
        });
    });
});
