// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { inspect } from 'util';

export function serializeError(error: any): string {
    return `[Error]{\n${inspect(error, { compact: false, depth: 4 })}\n}`;
}
