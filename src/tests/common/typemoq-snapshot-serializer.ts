// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

// This file is a Jest Snapshot Serializer which serializes all typemoq mock objects as a
// constant string, similar to how Jest serializes functions as the constant string "[Function]"
//
// References:
// * https://jestjs.io/docs/expect#expectaddsnapshotserializerserializer
// * https://jestjs.io/docs/configuration#snapshotserializers-arraystring
// * https://github.com/facebook/jest/blob/main/packages/pretty-format/README.md#serialize

// This is a hardcoded constant value that typemoq embeds into every Mock proxy object it creates.
// See https://github.com/florinn/typemoq/blob/master/src/Consts.ts
const typemoqProxyIdValue = 'BCDF5CE5-F0DF-40B7-8BA0-69DF395033C8';

export function test(val: unknown): boolean {
    return val != null && typeof val === 'object' && val['___id'] === typemoqProxyIdValue;
}

export function serialize(): string {
    return '[typemoq mock object]';
}
