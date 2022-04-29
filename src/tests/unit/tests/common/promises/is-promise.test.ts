// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { isPromise } from 'common/promises/is-promise';

describe(isPromise, () => {
    const asyncFunction = async () => {};
    const syncFunction = () => {};

    it('returns true for a new Promise()', () => {
        expect(isPromise(new Promise(() => {}))).toBe(true);
    });

    it('returns true for Promise.resolve()', () => {
        expect(isPromise(Promise.resolve())).toBe(true);
    });

    it('returns true for the result of an async function', () => {
        expect(isPromise(asyncFunction())).toBe(true);
    });

    it.each([undefined, null, 1, true, 'string', [], {}, syncFunction, asyncFunction])(
        'returns false for non-promise %p',
        input => {
            expect(isPromise(input)).toBe(false);
        },
    );
});
