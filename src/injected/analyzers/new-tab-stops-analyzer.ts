// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Message } from 'common/message';
import { Messages } from 'common/messages';
import { TabStopEvent } from 'common/types/tab-stop-event';
import { TabbableElementGetter, TabbableElementInfo } from 'injected/tabbable-element-getter';
import { debounce, DebouncedFunc } from 'lodash';
import { TabStopsListener } from '../tab-stops-listener';
import {
    Analyzer,
    FocusAnalyzerConfiguration,
    ScanBasePayload,
    ScanUpdatePayload,
    TabStopsScanCompletedPayload,
} from './analyzer';

export interface ProgressResult<T> {
    result: T;
}

export class NewTabStopsAnalyzer implements Analyzer {
    private debouncedProcessTabEvents: DebouncedFunc<() => void> | null = null;
    private pendingTabbedElements: TabStopEvent[] = [];

    constructor(
        private config: FocusAnalyzerConfiguration,
        private tabStopsListener: TabStopsListener,
        private sendMessage: (message) => void,
        private readonly tabbableElementGetter: TabbableElementGetter,
        private readonly debounceImpl: typeof debounce = debounce,
    ) {}

    public analyze(): void {
        this.initiateTabRecording();
        const calculatedTabStops = this.tabbableElementGetter.get();
        this.sendCalculatedResults(calculatedTabStops);
    }

    private initiateTabRecording = (): void => {
        this.debouncedProcessTabEvents?.cancel();
        this.debouncedProcessTabEvents = this.debounceImpl(this.processTabEvents, 50);
        this.tabStopsListener.setTabEventListenerOnMainWindow((tabEvent: TabStopEvent) => {
            this.pendingTabbedElements.push(tabEvent);
            this.debouncedProcessTabEvents();
        });
        this.tabStopsListener.startListenToTabStops();
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

    private sendCalculatedResults(calculatedTabStops: TabbableElementInfo[]): void {
        const payload: TabStopsScanCompletedPayload = {
            calculatedTabStops: calculatedTabStops,
        };
        const message: Message = {
            messageType: Messages.Visualizations.TabStops.ScanCompleted,
            payload,
        };
        this.sendMessage(message);
    }

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
