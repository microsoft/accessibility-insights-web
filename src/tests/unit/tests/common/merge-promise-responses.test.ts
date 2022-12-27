// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { mergePromiseResponses } from 'common/merge-promise-responses';
import { compact } from 'lodash';

type VerifiablePromise = {
    promise: Promise<void>;
    verify: () => void;
    error?: Error;
};

describe(mergePromiseResponses, () => {
    it('handles empty array', async () => {
        await mergePromiseResponses([]);
    });

    it('awaits all input promises concurrently if all inputs are async and successful', async () => {
        const verifiablePromises = [
            createVerifiableResolvingPromise(),
            createVerifiableResolvingPromise(),
            createVerifiableResolvingPromise(),
        ];
        const promises = verifiablePromises.map(item => item.promise);

        await mergePromiseResponses(promises);

        verifiablePromises.forEach(item => item.verify());
    });

    it('awaits all input promises and rejects without wrapping if a single input rejects', async () => {
        const verifiableRejectingPromise = createVerifiableRejectingPromise();
        const verifiablePromises = [
            createVerifiableResolvingPromise(),
            verifiableRejectingPromise,
            createVerifiableResolvingPromise(),
        ];
        const promises = verifiablePromises.map(item => item.promise);

        await expect(mergePromiseResponses(promises)).rejects.toThrowError(
            verifiableRejectingPromise.error,
        );
        verifiablePromises.forEach(item => item.verify());
    });

    it('awaits all input promises and aggregates errors if all inputs are async', async () => {
        const verifiablePromises = [
            createVerifiableResolvingPromise(),
            createVerifiableRejectingPromise(),
            createVerifiableRejectingPromise(),
        ];
        const promises = verifiablePromises.map(item => item.promise);
        const errors = compact(verifiablePromises.map(item => item.error));

        await expect(mergePromiseResponses(promises)).rejects.toMatchObject({ errors: errors });

        verifiablePromises.forEach(item => item.verify());
    });

    function createVerifiableResolvingPromise(): VerifiablePromise {
        const runPromiseMock = jest.fn();

        const createPromise = async () => runPromiseMock();

        return {
            promise: createPromise(),
            verify: () => expect(runPromiseMock).toHaveBeenCalledTimes(1),
        };
    }

    function createVerifiableRejectingPromise(): VerifiablePromise {
        const error = new Error('test error');
        const runPromiseMock = jest.fn();

        const createPromise = async () => {
            runPromiseMock();
            throw error;
        };

        return {
            promise: createPromise(),
            verify: () => expect(runPromiseMock).toHaveBeenCalledTimes(1),
            error: error,
        };
    }
});
