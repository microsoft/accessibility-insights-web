// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Logger } from 'common/logging/logger';
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

    constructor(
        config: FocusAnalyzerConfiguration,
        private readonly tabStopListenerRunner: AllFrameRunner<TabStopEvent>,
        sendMessageDelegate: (message) => void,
        scanIncompleteWarningDetector: ScanIncompleteWarningDetector,
        logger: Logger,
        private readonly tabStopsDoneAnalyzingTracker: TabStopsDoneAnalyzingTracker,
        private readonly tabStopsRequirementResultProcessor: TabStopsRequirementResultProcessor,
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
        await this.tabStopListenerRunner.start();

        this.tabStopsDoneAnalyzingTracker.reset();
        if (this.tabStopsRequirementResultProcessor) {
            await this.tabStopsRequirementResultProcessor.start();
        }

        return this.emptyResults;
    };

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
