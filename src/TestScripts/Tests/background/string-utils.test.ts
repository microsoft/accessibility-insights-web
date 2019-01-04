// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import '../../../background/string-utils';

describe('StringUtilsTests', () => {
    test('toTitleCase', () => {
        const original = 'vALUE';
        const expected = 'Value';

        const result = original.toTitleCase();

        expect(result).toEqual(expected);
    });
});
