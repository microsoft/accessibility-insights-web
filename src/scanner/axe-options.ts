// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as Axe from 'axe-core';

export interface AxeOptions {
    runOnly?: Axe.RunOnly;
    pingWaitTime?: number;
}
export type AxeScanContext = string | Document | IncludeExcludeOptions | NodeList;
export interface IncludeExcludeOptions {
    include?: string[][];
    exclude?: string[][];
}
