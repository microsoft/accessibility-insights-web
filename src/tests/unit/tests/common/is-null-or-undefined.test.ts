// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { isNullOrUndefined } from 'common/is-null-or-undefined';

describe('isNullOrUndefined', () => {
    it('returns true with null', () => {
        expect(isNullOrUndefined(null)).toBe(true);
    });

    it('returns true with undefined', () => {
        expect(isNullOrUndefined(undefined)).toBe(true);
    });

    it.each([0, false, NaN, '', 0n])('returns false with falsy value: %s', (value: any) => {
        expect(isNullOrUndefined(value)).toBe(false);
    });
});
