// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
export type DeepPartial<T> = { [P in keyof T]?: DeepPartial<T[P]> };
