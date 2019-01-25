// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
export function forceTestFailure(errorMessage: string): void {
    process.emit('uncaughtException', new Error(errorMessage));
}
