// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as Axe from 'axe-core';

import { AxeResponseHandler } from './axe-response-handler';
import { ScanOptions } from './scan-options';
import { ScanParameterGenerator } from './scan-parameter-generator';

export class Launcher {
    constructor(
        private axe: typeof Axe,
        private scanParameterGenerator: ScanParameterGenerator,
        private dom: Document,
        private options: ScanOptions,
    ) {}

    public runScan(responseHandler: AxeResponseHandler): void {
        const scanOptions = this.scanParameterGenerator.getAxeEngineOptions(
            this.options,
        );
        const scanContext = this.scanParameterGenerator.getContext(
            this.dom,
            this.options,
        );

        this.axe.run(
            scanContext as any,
            scanOptions,
            responseHandler.handleResponse.bind(responseHandler),
        );
    }
}
