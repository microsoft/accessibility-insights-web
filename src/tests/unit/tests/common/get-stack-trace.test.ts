// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { getStackTrace } from 'common/get-stack-trace';

// this describe block is intentionally named with different casing from the actual function
// because describe(name, () => {}) results in name appearing in stack traces and the tests need
// to distinguish whether or not "getStackTrace" itself appears in the stack traces it produces
describe('get-stack-trace', () => {
    it("should include the calling function's name in first line", () => {
        let stack: string | undefined;
        function namedCallingFunction() {
            stack = getStackTrace();
        }
        namedCallingFunction();

        expect(stack.split('\n')[0]).toContain('namedCallingFunction');
    });

    it('should not include the frame for the function itself', () => {
        expect(getStackTrace()).not.toContain('getStackTrace');
    });

    it("should not include the stub error's message line", () => {
        expect(getStackTrace()).not.toContain('Error:');
    });

    it('should omit a line per ignored frame', () => {
        const stackIgnoring0Frames = getStackTrace();
        const linesInStackIgnoring0Frames = stackIgnoring0Frames.split('\n').length;

        const stackIgnoring2Frames = getStackTrace({ framesToIgnore: 2 });
        const linesInStackIgnoring2Frames = stackIgnoring2Frames.split('\n').length;

        expect(linesInStackIgnoring0Frames).toEqual(linesInStackIgnoring2Frames + 2);
        expect(stackIgnoring0Frames.endsWith(stackIgnoring2Frames)).toBe(true);
    });
});
