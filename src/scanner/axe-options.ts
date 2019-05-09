// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as Axe from 'axe-core';

export interface AxeOptions {
    runOnly?: Axe.RunOnly;
    restoreScroll?: Boolean; // missing from axe options.
}
export type AxeScanContext = string | NodeSelector & Node | IncludeExcludeOptions | NodeList;
export interface IncludeExcludeOptions {
    include: string[][];
    exclude: string[][];
}
