// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { autobind } from '@uifabric/utilities';
import * as Q from 'q';
import { WindowUtils } from './../../common/window-utils';
import { ITabStopEvent, TabStopsListener } from './../tab-stops-listener';
import { AxeAnalyzerResult, Analyzer, IFocusAnalyzerConfiguration, IScanBasePayload, IScanUpdatePayload } from './analyzer';
import { BaseAnalyzer } from './base-analyzer';

export interface ProgressResult<T> {
    result: T;
}

export class TabStopsAnalyzer extends BaseAnalyzer implements Analyzer {
    private tabStopsListener: TabStopsListener;
    private deferred: Q.Deferred<AxeAnalyzerResult>;
    private _windowUtils: WindowUtils;

    private _pendingTabbedElements: ITabStopEvent[] = [];
    private _onTabbedTimeoutId: number;
    protected config: IFocusAnalyzerConfiguration;

    constructor(
        config: IFocusAnalyzerConfiguration,
        tabStopsListener: TabStopsListener,
        windowUtils: WindowUtils,
        sendMessageDelegate: (message) => void,
    ) {
        super(config, sendMessageDelegate);
        this.tabStopsListener = tabStopsListener;
        this._windowUtils = windowUtils;
    }

    public analyze(): void {
        // We intentionally float this promise; the current analyzer API is that analyze starts the
        // analysis and it's allowed to continue running for arbitrarily long until teardown() is called.
        // We use a Promise for this internally only so we can reuse Q's "onprogress" behavior.
        //
        // tslint:disable-next-line:no-floating-promises
        this.getResults().progress(this.onProgress);
    }

    protected getResults(): Q.Promise<AxeAnalyzerResult> {
        this.deferred = Q.defer<AxeAnalyzerResult>();
        this.tabStopsListener.setTabEventListenerOnMainWindow((tabEvent: ITabStopEvent) => {
            if (this._onTabbedTimeoutId != null) {
                this._windowUtils.clearTimeout(this._onTabbedTimeoutId);
                this._onTabbedTimeoutId = null;
            }

            this._pendingTabbedElements.push(tabEvent);

            this._onTabbedTimeoutId = this._windowUtils.setTimeout(() => {
                this.deferred.notify({
                    result: this._pendingTabbedElements,
                });
                this._onTabbedTimeoutId = null;
                this._pendingTabbedElements = [];
            }, 50);
        });

        this.tabStopsListener.startListenToTabStops();
        this.analyzerSetupComplete();
        return this.deferred.promise;
    }

    private analyzerSetupComplete(): void {
        this.onResolve(this.emptyResults);
    }

    @autobind
    protected onProgress(progressResult: ProgressResult<ITabStopEvent[]>): void {
        const payload: IScanUpdatePayload = {
            key: this.config.key,
            testType: this.config.testType,
            tabbedElements: progressResult.result,
            results: progressResult.result,
        };

        const message = {
            type: this.config.analyzerProgressMessageType,
            payload,
        };
        this.sendMessage(message);
    }

    public teardown(): void {
        this.tabStopsListener.stopListenToTabStops();
        const payload: IScanBasePayload = {
            key: this.config.key,
            testType: this.config.testType,
        };

        this.sendMessage({
            type: this.config.analyzerTerminatedMessageType,
            payload,
        });
    }
}
