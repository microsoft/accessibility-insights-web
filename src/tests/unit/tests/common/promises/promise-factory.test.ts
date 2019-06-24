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

            return expect(timingOut).rejects.toEqual(`Timed out ${delay} ms`);
        });
    });
});
