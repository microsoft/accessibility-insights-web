// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BaseStore } from 'common/base-store';
import { FeatureFlags } from 'common/feature-flags';
import { Logger } from 'common/logging/logger';
import { AxeAnalyzerResult } from 'common/types/axe-analyzer-result';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { TabStopEvent } from 'common/types/tab-stop-event';
import { TabStopRequirementActionMessageCreator } from 'DetailsView/actions/tab-stop-requirement-action-message-creator';
import { AllFrameRunner } from 'injected/all-frame-runner';
import { BaseAnalyzer } from 'injected/analyzers/base-analyzer';
import { ScanIncompleteWarningDetector } from 'injected/scan-incomplete-warning-detector';
import { TabStopRequirementResult } from 'injected/tab-stops-requirement-evaluator';
import { debounce, DebouncedFunc, isEqual } from 'lodash';
import { FocusAnalyzerConfiguration, ScanBasePayload, ScanUpdatePayload } from './analyzer';

export interface ProgressResult<T> {
    result: T;
}

export class TabStopsAnalyzer extends BaseAnalyzer {
    private debouncedProcessTabEvents: DebouncedFunc<() => void> | null = null;
    private pendingTabbedElements: TabStopEvent[] = [];
    protected config: FocusAnalyzerConfiguration;

    private seenTabStopRequirementResults: TabStopRequirementResult[] = [];

    constructor(
        config: FocusAnalyzerConfiguration,
        private readonly tabStopListenerRunner: AllFrameRunner<TabStopEvent>,
        sendMessageDelegate: (message) => void,
        scanIncompleteWarningDetector: ScanIncompleteWarningDetector,
        logger: Logger,
        private readonly featureFlagStore: BaseStore<FeatureFlagStoreData>,
        private readonly tabStopRequirementRunner: AllFrameRunner<TabStopRequirementResult>,
        private readonly tabStopRequirementActionMessageCreator: TabStopRequirementActionMessageCreator,
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
        this.tabStopListenerRunner.start();

        if (this.featureFlagStore.getState()[FeatureFlags.tabStopsAutomation] === true) {
            this.seenTabStopRequirementResults = [];
            this.tabStopRequirementRunner.topWindowCallback = this.processTabStopRequirementResults;
            this.tabStopRequirementRunner.start();
        }

        return this.emptyResults;
    };

    private processTabStopRequirementResults = (
        tabStopRequirementResult: TabStopRequirementResult,
    ): void => {
        const duplicateResult = this.seenTabStopRequirementResults.some(r =>
            isEqual(r, tabStopRequirementResult),
        );

        if (!duplicateResult) {
            this.tabStopRequirementActionMessageCreator.addTabStopInstance(
                tabStopRequirementResult.requirementId,
                tabStopRequirementResult.description,
            );
            this.seenTabStopRequirementResults.push(tabStopRequirementResult);
        }
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
        this.tabStopListenerRunner.stop();
        this.tabStopRequirementRunner.stop();

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
