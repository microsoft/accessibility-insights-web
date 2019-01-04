// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as _ from 'lodash';

import * as assert from '../Common/assertions';

global.console.log = jest.fn();

describe('assertions', () => {
    test('isTrue', () => {
        expect(() => assert.isTrue(true)).not.toThrow();
        expect(() => assert.isTrue(false)).toThrow();
    });

    test('isNotNullOrUndefined', () => {
        expect(() => assert.isNotNullOrUndefined(null)).toThrow();
        expect(() => assert.isNotNullOrUndefined(undefined)).toThrow();
        expect(() => assert.isNotNullOrUndefined(1)).not.toThrow();
    });

    test('fail', () => {
        expect(() => assert.fail("message")).toThrow();
    });

    test('verifyErrorThrown', () => {
        const thrower = () => { throw new Error('Correct message') };
        expect(() => assert.verifyErrorThrown(thrower, null)).not.toThrow();
        expect(() => assert.verifyErrorThrown(thrower, null, 'Correct message')).not.toThrow();
        expect(() => assert.verifyErrorThrown(thrower, null, 'Wrong message')).toThrow();
        expect(() => assert.verifyErrorThrown(() => {}, null)).toThrow();
    });

    test('message output', () => {
        expect(() => assert.fail('my custom message')).toThrow();
        expect(global.console.log).toBeCalledWith('Assertion Message: my custom message');
    });

    [
        {
            typeName: 'string',
            original: ['a', 'b', 'c'],
            different: ['x', 'y', 'z']
        },
        {
            typeName: 'number',
            original: [1, 2, 3],
            different: [4, 5, 6]
        },
        {
            typeName: 'boolean',
            isUnorderable: true,
            original: [true, true, false],
            different: [false, true, false]
        },
        {
            typeName: 'object',
            isObject: true,
            original: [{ a: 1 }, { b: 2 }, { c: 3 }],
            different: [{ x: 4 }, { y: 5 }, { z: 6 }]
        },
        {
            typeName: 'undefined and null',
            isUnorderable: true,
            original: [null, undefined, undefined],
            different: [undefined, null, undefined]
        },
        {
            typeName: 'mixed',
            original: [1, 'a', { a: 1 }, null, undefined],
            different: ['b', 2, { b: 2 }, undefined, null]
        }
    ].forEach(({
        typeName,
        isObject,
        isUnorderable,
        original,
        different
    }) => {
        const copy = _.cloneDeep(original);
        const reverse = _.reverse(_.cloneDeep(original));

        describe(`comparison tests with ${typeName}`, () => {

            test('areEqual', () => {
                expect(() => assert.areEqual(original[0], original[0])).not.toThrow();
                if (isObject) {
                    expect(() => assert.areEqual(original[0], copy[0])).toThrow();
                } else {
                    expect(() => assert.areEqual(original[0], copy[0])).not.toThrow();
                }
                expect(() => assert.areEqual(original[0], different[0])).toThrow();
            });

            test('areNotEqual', () => {
                expect(() => assert.areNotEqual(original[0], original[0])).toThrow();
                if (isObject) {
                    expect(() => assert.areNotEqual(original[0], copy[0])).not.toThrow();
                } else {
                    expect(() => assert.areNotEqual(original[0], copy[0])).toThrow();
                }
                expect(() => assert.areNotEqual(original[0], different[0])).not.toThrow();
            });

            test('areEqualObjects', () => {
                expect(() => assert.areEqualObjects(original, original)).not.toThrow();
                expect(() => assert.areEqualObjects(original, copy)).not.toThrow();
                expect(() => assert.areEqualObjects(original, different)).toThrow();
            });

            test('arrayUnorderedEquals', () => {
                expect(() => assert.arrayUnorderedEquals(original, original)).not.toThrow();
                expect(() => assert.arrayUnorderedEquals(original, copy)).not.toThrow();
                if (isUnorderable) {
                    expect(() => assert.arrayUnorderedEquals(original, different)).not.toThrow();
                } else {
                    expect(() => assert.arrayUnorderedEquals(original, different)).toThrow();

                }
                expect(() => assert.arrayUnorderedEquals(original, reverse)).not.toThrow();
            });
        });
    });
});
