// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { StringUtils } from '../../../../scanner/string-utils';

describe('StringUtils', () => {
    describe('isNotEmpty', () => {
        it('should return true if it has content', () => {
            expect(StringUtils.isNotEmpty('hello')).toBeTruthy();
        });

        it('should return false if it has no content', () => {
            expect(StringUtils.isNotEmpty('')).toBeFalsy();
            expect(StringUtils.isNotEmpty('   ')).toBeFalsy();
            expect(StringUtils.isNotEmpty(null)).toBeFalsy();
            expect(StringUtils.isNotEmpty(undefined)).toBeFalsy();
        });
    });
});
