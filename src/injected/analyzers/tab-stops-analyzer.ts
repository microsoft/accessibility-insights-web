// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Logger } from 'common/logging/logger';
import { PromiseFactory, TimeoutError } from 'common/promises/promise-factory';
import { AxeAnalyzerResult } from 'common/types/axe-analyzer-result';
import { TabStopEvent } from 'common/types/store-data/tab-stop-event';
import { AllFrameRunner } from 'injected/all-frame-runner';
import { BaseAnalyzer } from 'injected/analyzers/base-analyzer';
import { TabStopsDoneAnalyzingTracker } from 'injected/analyzers/tab-stops-done-analyzing-tracker';
import { TabStopsRequirementResultProcessor } from 'injected/analyzers/tab-stops-requirement-result-processor';
import { ScanIncompleteWarningDetector } from 'injected/scan-incomplete-warning-detector';
import { debounce, DebouncedFunc } from 'lodash';
import { FocusAnalyzerConfiguration, ScanBasePayload, ScanUpdatePayload } from './analyzer';

export interface ProgressResult<T> {
    result: T;
}

export class TabStopsAnalyzer extends BaseAnalyzer {
    private debouncedProcessTabEvents: DebouncedFunc<() => void> | null = null;
    private pendingTabbedElements: TabStopEvent[] = [];
    protected config: FocusAnalyzerConfiguration;
    private startTimeoutMilliseconds = 500;

    constructor(
        config: FocusAnalyzerConfiguration,
        private readonly tabStopListenerRunner: AllFrameRunner<TabStopEvent>,
        sendMessageDelegate: (message) => void,
        scanIncompleteWarningDetector: ScanIncompleteWarningDetector,
        logger: Logger,
        private readonly tabStopsDoneAnalyzingTracker: TabStopsDoneAnalyzingTracker,
        private readonly tabStopsRequirementResultProcessor: TabStopsRequirementResultProcessor,
        private readonly promiseFactory: PromiseFactory,
        private readonly debounceImpl: typeof debounce = debounce,
    ) {
        super(config, sendMessageDelegate, scanIncompleteWarningDetector, logger);
    }

    protected getResults = async (): Promise<AxeAnalyzerResult> => {
        this.debouncedProcessTabEvents?.cancel();
        this.debouncedProcessTabEvents = this.debounceImpl(this.processTabEvents, 50);
        this.tabStopListenerRunner.topWindowCallback = (tabEvent: TabStopEvent) => {
            this.pendingTabbedElements.push(tabEvent);
            this.debouncedProcessTabEvents();
        };

        await this.runWithIgnoredTimeout(
            this.tabStopListenerRunner.start(),
            this.startTimeoutMilliseconds,
            'start tabStopListenerRunner',
        );

        this.tabStopsDoneAnalyzingTracker.reset();
        if (this.tabStopsRequirementResultProcessor) {
            await this.runWithIgnoredTimeout(
                this.tabStopsRequirementResultProcessor.start(),
                this.startTimeoutMilliseconds,
                'start tabStopsRequirementResultProcessor',
            );
        }

        return this.emptyResults;
    };

    private async runWithIgnoredTimeout(
        promise: Promise<void>,
        maxWaitTime: number,
        taskDescription: string,
    ): Promise<void> {
        try {
            // Try to wait for the promise to complete, but allow execution to continue if
            // it times out. This is a temporary workaround in case frame messaging fails.
            // For more info, see https://github.com/microsoft/accessibility-insights-web/issues/5931
            await this.promiseFactory.timeout(promise, maxWaitTime);
        } catch (e) {
            if (e instanceof TimeoutError) {
                this.logger.error(
                    `Timeout of ${maxWaitTime} ms exceeded while attempting to ${taskDescription}. Tab stops analyzer will attempt to continue.`,
                );
            } else {
                throw e;
            }
        }
    }

    private processTabEvents = (): void => {
        this.tabStopsDoneAnalyzingTracker.addTabStopEvents(this.pendingTabbedElements);

        const results = this.pendingTabbedElements;
        this.pendingTabbedElements = [];

        const payload: ScanUpdatePayload = {
            key: this.config.key,
            testType: this.config.testType,
            tabbedElements: results,
            results: results,
        };

        const message = {
            messageType: this.config.analyzerProgressMessageType,
            payload,
        };
        this.sendMessage(message);
    };

    public async teardown(): Promise<void> {
        this.debouncedProcessTabEvents?.cancel();
        await this.tabStopListenerRunner.stop();
        await this.tabStopsRequirementResultProcessor.stop();

        const payload: ScanBasePayload = {
            key: this.config.key,
            testType: this.config.testType,
        };

        this.sendMessage({
            messageType: this.config.analyzerTerminatedMessageType,
            payload,
        });
    }
}
