// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Logger } from 'common/logging/logger';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { TabStopEvent } from 'common/types/tab-stop-event';
import { TabStopRequirementActionMessageCreator } from 'DetailsView/actions/tab-stop-requirement-action-message-creator';
import { AllFrameRunner } from 'injected/all-frame-runner';
import { ScanIncompleteWarningDetector } from 'injected/scan-incomplete-warning-detector';
import { TabStopRequirementResult } from 'injected/tab-stops-requirement-evaluator';
import { BaseStore } from '../../common/base-store';
import { TelemetryDataFactory } from '../../common/telemetry-data-factory';
import { ScopingStoreData } from '../../common/types/store-data/scoping-store-data';
import { ScannerUtils } from '../scanner-utils';
import {
    Analyzer,
    AnalyzerConfiguration,
    FocusAnalyzerConfiguration,
    RuleAnalyzerConfiguration,
} from './analyzer';
import { BaseAnalyzer } from './base-analyzer';
import { BatchedRuleAnalyzer, IResultRuleFilter } from './batched-rule-analyzer';
import { PostResolveCallback, RuleAnalyzer } from './rule-analyzer';
import { TabStopsAnalyzer } from './tab-stops-analyzer';

export class AnalyzerProvider {
    constructor(
        private readonly tabStopsListener: AllFrameRunner<TabStopEvent>,
        private readonly tabStopsRequirementRunner: AllFrameRunner<TabStopRequirementResult>,
        private readonly tabStopRequirementActionMessageCreator: TabStopRequirementActionMessageCreator,
        private readonly featureFlagStore: BaseStore<FeatureFlagStoreData>,
        private readonly scopingStore: BaseStore<ScopingStoreData>,
        private readonly sendMessageDelegate: (message) => void,
        private readonly scanner: ScannerUtils,
        private readonly telemetryDataFactory: TelemetryDataFactory,
        private readonly dateGetter: () => Date,
        private readonly filterResultsByRules: IResultRuleFilter,
        private readonly sendConvertedResults: PostResolveCallback,
        private readonly sendNeedsReviewResults: PostResolveCallback,
        private readonly scanIncompleteWarningDetector: ScanIncompleteWarningDetector,
        private readonly logger: Logger,
    ) {
        this.tabStopsListener = tabStopsListener;
        this.scopingStore = scopingStore;
        this.sendMessageDelegate = sendMessageDelegate;
        this.scanner = scanner;
        this.telemetryDataFactory = telemetryDataFactory;
        this.dateGetter = dateGetter;
    }

    public createRuleAnalyzer(config: RuleAnalyzerConfiguration): Analyzer {
        return new RuleAnalyzer(
            config,
            this.scanner,
            this.scopingStore,
            this.sendMessageDelegate,
            this.dateGetter,
            this.telemetryDataFactory,
            null,
            this.scanIncompleteWarningDetector,
            this.logger,
        );
    }

    // This analyzer is functionally identical to the rule-analyzer, but it
    // sends an additional message to the unified-scan-results store
    public createRuleAnalyzerUnifiedScan(config: RuleAnalyzerConfiguration): Analyzer {
        return new RuleAnalyzer(
            config,
            this.scanner,
            this.scopingStore,
            this.sendMessageDelegate,
            this.dateGetter,
            this.telemetryDataFactory,
            this.sendConvertedResults,
            this.scanIncompleteWarningDetector,
            this.logger,
        );
    }

    public createRuleAnalyzerUnifiedScanForNeedsReview(
        config: RuleAnalyzerConfiguration,
    ): Analyzer {
        return new RuleAnalyzer(
            config,
            this.scanner,
            this.scopingStore,
            this.sendMessageDelegate,
            this.dateGetter,
            this.telemetryDataFactory,
            this.sendNeedsReviewResults,
            this.scanIncompleteWarningDetector,
            this.logger,
        );
    }

    public createBatchedRuleAnalyzer(config: RuleAnalyzerConfiguration): Analyzer {
        return new BatchedRuleAnalyzer(
            config,
            this.scanner,
            this.scopingStore,
            this.sendMessageDelegate,
            this.dateGetter,
            this.telemetryDataFactory,
            this.filterResultsByRules,
            this.scanIncompleteWarningDetector,
            this.logger,
        );
    }

    public createFocusTrackingAnalyzer(config: FocusAnalyzerConfiguration): Analyzer {
        return new TabStopsAnalyzer(
            config,
            this.tabStopsListener,
            this.sendMessageDelegate,
            this.scanIncompleteWarningDetector,
            this.logger,
            this.featureFlagStore,
            this.tabStopsRequirementRunner,
            this.tabStopRequirementActionMessageCreator,
        );
    }

    public createBaseAnalyzer(config: AnalyzerConfiguration): Analyzer {
        return new BaseAnalyzer(
            config,
            this.sendMessageDelegate,
            this.scanIncompleteWarningDetector,
            this.logger,
        );
    }
}
