// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as Axe from 'axe-core';

import { AxeResponseHandler } from './axe-response-handler';
import { ScanOptions } from './exposed-apis';
import { ScanParameterGenerator } from './scan-parameter-generator';

export interface AxeOptions {
    runOnly?: Axe.RunOnly;
    restoreScroll?: Boolean; // missing from axe options.
}

export type AxeScanContext = string | NodeSelector & Node | IncludeExcludeOptions | NodeList;

export interface IncludeExcludeOptions {
    include: string[][];
    exclude: string[][];
}

export class Launcher {
    constructor(
        private axe: typeof Axe,
        private scanParameterGenerator: ScanParameterGenerator,
        private dom: NodeSelector & Node,
        private options: ScanOptions,
    ) {}

    public runScan(responseHandler: AxeResponseHandler): void {
        const scanOptions = this.scanParameterGenerator.getAxeEngineOptions(this.options);
        const scanContext = this.scanParameterGenerator.getContext(this.dom, this.options);

        this.axe.run(scanContext as any, scanOptions, responseHandler.handleResponse.bind(responseHandler));
    }
}
