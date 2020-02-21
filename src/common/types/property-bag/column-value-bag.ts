// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
export type BagOf<T> = { [K in string]: T };
export type ScalarColumnValue = string | number | Date | boolean;
export type ColumnValue = ScalarColumnValue | BagOf<ScalarColumnValue>;
export type ColumnValueBag = BagOf<ColumnValue>;

export function isScalarColumnValue(value): value is ScalarColumnValue {
    return (
        typeof value === 'string' ||
        typeof value === 'boolean' ||
        typeof value === 'number' ||
        value instanceof Date
    );
}
