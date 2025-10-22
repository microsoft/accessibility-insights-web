// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { EnumHelper } from '../../../../common/enum-helper';

enum TestNumericEnum {
    first = 100,
    second = 200,
    third = 300,
}

enum TestStringEnum {
    first = '1',
    second = '2',
    third = '3',
}

describe('EnumHelperTest', () => {
    test('happy path', () => {
        const result = EnumHelper.getNumericValues<TestNumericEnum>(TestNumericEnum);

        const expected = [100, 200, 300];

        expect(result).toEqual(expected);
    });

    test('string enum', () => {
        const action = () => EnumHelper.getNumericValues<TestStringEnum>(TestStringEnum);

        expect(action).toThrowError(`No 'number' key found on ${JSON.stringify(TestStringEnum)}`);
    });
});
