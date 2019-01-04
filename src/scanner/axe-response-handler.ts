// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as Axe from 'axe-core';

import { ScanResults } from './iruleresults';
import { ResultDecorator } from './result-decorator';

export class AxeResponseHandler {
    constructor(
        private successCallback: (results: ScanResults) => void,
        private errorCallback: (error: Error) => void,
        private resultDecorator: ResultDecorator,
    ) {}

    public handleResponse(error: Error, results: Axe.AxeResults): void {
        if (error) {
            this.errorCallback(error);
            throw error;
        }

        const decoratedResults = this.resultDecorator.decorateResults(results);

        this.successCallback(decoratedResults);
    }
}
