// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Logger } from 'common/logging/logger';
import { WindowUtils } from 'common/window-utils';
import { ScanIncompleteWarningDetector } from 'injected/scan-incomplete-warning-detector';
import * as Q from 'q';

import { TabStopEvent, TabStopsListener } from '../tab-stops-listener';
import {
    AxeAnalyzerResult,
    FocusAnalyzerConfiguration,
    ScanBasePayload,
    ScanUpdatePayload,
} from './analyzer';
import { BaseAnalyzer } from './base-analyzer';

export interface ProgressResult<T> {
    result: T;
}

export class TabStopsAnalyzer extends BaseAnalyzer {
    private tabStopsListener: TabStopsListener;
    private deferred: Q.Deferred<AxeAnalyzerResult>;
    private windowUtils: WindowUtils;

    private pendingTabbedElements: TabStopEvent[] = [];
    private onTabbedTimeoutId: number;
    protected config: FocusAnalyzerConfiguration;

    constructor(
        config: FocusAnalyzerConfiguration,
        tabStopsListener: TabStopsListener,
        windowUtils: WindowUtils,
        sendMessageDelegate: (message) => void,
        scanIncompleteWarningDetector: ScanIncompleteWarningDetector,
        logger: Logger,
    ) {
        super(config, sendMessageDelegate, scanIncompleteWarningDetector, logger);
        this.tabStopsListener = tabStopsListener;
        this.windowUtils = windowUtils;
    }

    public analyze(): void {
        // We intentionally float this promise; the current analyzer API is that analyze starts the
        // analysis and it's allowed to continue running for arbitrarily long until teardown() is called.
        // We use a Promise for this internally only so we can reuse Q's "onprogress" behavior.
        this.getResults().progress(this.onProgress).catch(this.logger.error);
    }

    protected getResults = (): Q.Promise<AxeAnalyzerResult> => {
        this.deferred = Q.defer<AxeAnalyzerResult>();
        this.tabStopsListener.setTabEventListenerOnMainWindow((tabEvent: TabStopEvent) => {
            if (this.onTabbedTimeoutId != null) {
                this.windowUtils.clearTimeout(this.onTabbedTimeoutId);
                this.onTabbedTimeoutId = null;
            }

            this.pendingTabbedElements.push(tabEvent);

            this.onTabbedTimeoutId = this.windowUtils.setTimeout(() => {
                this.deferred.notify({
                    result: this.pendingTabbedElements,
                });
                this.onTabbedTimeoutId = null;
                this.pendingTabbedElements = [];
            }, 50);
        });

        this.tabStopsListener.startListenToTabStops();
        this.analyzerSetupComplete();
        return this.deferred.promise;
    };

    private analyzerSetupComplete(): void {
        this.onResolve(this.emptyResults);
    }

    protected onProgress = (progressResult: ProgressResult<TabStopEvent[]>): void => {
        const payload: ScanUpdatePayload = {
            key: this.config.key,
            testType: this.config.testType,
            tabbedElements: progressResult.result,
            results: progressResult.result,
        };

        const message = {
            messageType: this.config.analyzerProgressMessageType,
            payload,
        };
        this.sendMessage(message);
    };

    public teardown(): void {
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
