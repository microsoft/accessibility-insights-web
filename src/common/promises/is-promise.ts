// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

export function isPromise(value: unknown): value is Promise<unknown> {
    // Don't use instanceof Promise; it can get confused by transpilation
    return !!value && typeof (value as any).then === 'function';
}
