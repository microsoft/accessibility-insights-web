// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
function withMessage(message: string, fn: () => void) {
    try {
        fn();
    } catch (e) {
        if (message) {
            console.log('Assertion Message: ' + message);
        }
        throw e;
    }
}

export function areEqual(expected: any, actual: any, message?: string): void {
    withMessage(message, () => expect(actual).toBe(expected));
}

export function areNotEqual(expected: any, actual: any, message?: string): void {
    withMessage(message, () => expect(actual).not.toBe(expected));
}

export function areEqualObjects(expected: any, actual: any, message?: string): void {
    withMessage(message, () => expect(actual).toEqual(expected));
}

export function fail(message?: string) {
    withMessage(message, () => expect(message).toBeFalsy());
}

export function isTrue(actual: boolean, message?: string): void {
    withMessage(message, () => expect(actual).toBeTruthy());
}

export function isNotNullOrUndefined(actual: any, message?: string): void {
    withMessage(message, () => expect(actual).toEqual(expect.anything()));
}

export function verifyErrorThrown(action: () => void, failureMessage: string, expectedErrorMessage?: string): void {
    withMessage(failureMessage, () => expect(action).toThrow(expectedErrorMessage));
}

export function arrayUnorderedEquals(expected: any[], actual: any[], message?: string): void {
    withMessage(message, () => expect(actual).toEqual(expect.arrayContaining(expected)));
}
