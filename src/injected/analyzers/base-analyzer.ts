// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as Q from 'q';

import { Message } from 'common/message';
import { VisualizationType } from 'common/types/visualization-type';
import { ScanIncompleteWarningDetector } from 'injected/scan-incomplete-warning-detector';
import { Analyzer, AnalyzerConfiguration, AxeAnalyzerResult, ScanCompletedPayload } from './analyzer';

export class BaseAnalyzer implements Analyzer {
    protected visualizationType: VisualizationType;
    protected emptyResults: AxeAnalyzerResult = {
        results: {},
        originalResult: null,
    };

    constructor(
        protected config: AnalyzerConfiguration,
        protected sendMessage: (message) => void,
        private scanIncompleteWarningDetector: ScanIncompleteWarningDetector,
    ) {
        this.visualizationType = config.testType;
    }

    public analyze(): void {
        const results = this.getResults();

        // We intentionally float this promise; the current analyzer API is that analyze starts the
        // analysis and it's allowed to continue running for arbitrarily long until teardown() is called.
        //
        // tslint:disable-next-line:no-floating-promises
        results.then(this.onResolve);
    }

    public teardown(): void {}

    protected getResults = (): Q.Promise<AxeAnalyzerResult> => {
        return Q(this.emptyResults);
    };

    protected onResolve = (analyzerResult: AxeAnalyzerResult): void => {
        this.sendMessage(this.createBaseMessage(analyzerResult, this.config));
    };

    protected createBaseMessage(analyzerResult: AxeAnalyzerResult, config: AnalyzerConfiguration): Message {
        const messageType = config.analyzerMessageType;
        const originalAxeResult = analyzerResult.originalResult;
        const payload: ScanCompletedPayload<any> = {
            key: config.key,
            selectorMap: analyzerResult.results,
            scanResult: originalAxeResult,
            testType: config.testType,
            scanIncompleteWarnings: this.scanIncompleteWarningDetector.detectScanIncompleteWarnings(),
        };

        return {
            messageType,
            payload,
        };
    }
}
