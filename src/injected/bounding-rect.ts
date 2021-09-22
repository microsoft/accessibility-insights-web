// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

// These are the subsets of the native DOMRect/ClientRect types that we use in practice.
// Using smaller interfaces makes it easier to stub them during tests.

export type BoundingRect = {
    left: number;
    right: number;
    top: number;
    bottom: number;
    width: number;
    height: number;
};

export type BoundingRectOffset = {
    left: number;
    top: number;
};
