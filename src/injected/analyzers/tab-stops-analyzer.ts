// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Logger } from 'common/logging/logger';
import { AxeAnalyzerResult } from 'common/types/axe-analyzer-result';
import { TabStopEvent } from 'common/types/tab-stop-event';
import { BaseAnalyzer } from 'injected/analyzers/base-analyzer';
import { ScanIncompleteWarningDetector } from 'injected/scan-incomplete-warning-detector';
import { TabStopsListener } from 'injected/tab-stops-listener';
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
        private readonly tabStopsListener: TabStopsListener,
        sendMessageDelegate: (message) => void,
        scanIncompleteWarningDetector: ScanIncompleteWarningDetector,
        logger: Logger,
        private readonly debounceImpl: typeof debounce = debounce,
    ) {
        super(config, sendMessageDelegate, scanIncompleteWarningDetector, logger);
    }

    protected getResults = async (): Promise<AxeAnalyzerResult> => {
        this.debouncedProcessTabEvents?.cancel();
        this.debouncedProcessTabEvents = this.debounceImpl(this.processTabEvents, 50);
        this.tabStopsListener.setTabEventListenerOnMainWindow((tabEvent: TabStopEvent) => {
            this.pendingTabbedElements.push(tabEvent);
            this.debouncedProcessTabEvents();
        });
        this.tabStopsListener.startListenToTabStops();
        return this.emptyResults;
    };

    private processTabEvents = (): void => {
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

    public teardown(): void {
        this.debouncedProcessTabEvents?.cancel();
        this.tabStopsListener.stopListenToTabStops();

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
