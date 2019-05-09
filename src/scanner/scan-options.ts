// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
export interface ScanOptions {
    testsToRun?: string[];
    dom?: NodeSelector & Node | NodeList;
    selector?: string;
    include?: string[][];
    exclude?: string[][];
}
