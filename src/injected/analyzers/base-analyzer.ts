// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Logger } from 'common/logging/logger';
import { Message } from 'common/message';
import { AxeAnalyzerResult } from 'common/types/axe-analyzer-result';
import { VisualizationType } from 'common/types/visualization-type';
import { ScanIncompleteWarningDetector } from 'injected/scan-incomplete-warning-detector';
import * as Q from 'q';

import { Analyzer, AnalyzerConfiguration, ScanCompletedPayload } from './analyzer';

export class BaseAnalyzer implements Analyzer {
    protected visualizationType: VisualizationType;
    protected emptyResults: AxeAnalyzerResult = {
        results: {},
        originalResult: null,
    };

    constructor(
        protected readonly config: AnalyzerConfiguration,
        protected readonly sendMessage: (message) => void,
        private readonly scanIncompleteWarningDetector: ScanIncompleteWarningDetector,
        protected readonly logger: Logger,
    ) {
        this.visualizationType = config.testType;
    }

    public analyze(): void {
        const results = this.getResults();
        results.then(this.onResolve).catch(this.logger.error);
    }

    public teardown(): void {}

    protected getResults = (): Q.Promise<AxeAnalyzerResult> => {
        return Q(this.emptyResults);
    };

    protected onResolve = (analyzerResult: AxeAnalyzerResult): void => {
        this.sendMessage(this.createBaseMessage(analyzerResult, this.config));
    };

    protected createBaseMessage(
        analyzerResult: AxeAnalyzerResult,
        config: AnalyzerConfiguration,
    ): Message {
        const messageType = config.analyzerMessageType;
        const originalAxeResult = analyzerResult.originalResult;
        const payload: ScanCompletedPayload<any> = {
            key: config.key,
            selectorMap: analyzerResult.results,
            scanResult: originalAxeResult,
            testType: config.testType,
            scanIncompleteWarnings:
                this.scanIncompleteWarningDetector.detectScanIncompleteWarnings(),
        };

        return {
            messageType,
            payload,
        };
    }
}
