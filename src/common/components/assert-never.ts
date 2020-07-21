// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

// This function helps with exhaustiveness checking in switch statements
// If used in the default case, TS will throw an error unless all cases are handled.
export const assertNever = (x: never): never => {
    throw Error(
        'This error should never be thrown when strict null checks are applied to this project',
    );
};
