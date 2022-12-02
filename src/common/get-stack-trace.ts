// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

export type GetStackTraceOptions = {
    // This number should not include the frame for getStackTrace() itself, which is always ignored
    framesToIgnore?: number;
};

export function getStackTrace(options?: GetStackTraceOptions): string {
    const rawStack = new Error().stack!;
    const framesToIgnore = options?.framesToIgnore ?? 0;

    // first line is "Error: "
    // second line is the frame for getStackTrace() itself
    const linesToIgnore = framesToIgnore + 2;

    return rawStack.split('\n').splice(linesToIgnore).join('\n');
}
