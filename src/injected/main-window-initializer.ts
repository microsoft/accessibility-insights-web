// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Assessments } from 'assessments/assessments';
import { createToolData } from 'common/application-properties-provider';
import { getCardSelectionViewData } from 'common/get-card-selection-view-data';
import { isResultHighlightUnavailableWeb } from 'common/is-result-highlight-unavailable';
import { Logger } from 'common/logging/logger';
import { StoreUpdateMessageHub } from 'common/store-update-message-hub';
import { ClientStoresHub } from 'common/stores/client-stores-hub';
import { CardSelectionStoreData } from 'common/types/store-data/card-selection-store-data';
import { NeedsReviewCardSelectionStoreData } from 'common/types/store-data/needs-review-card-selection-store-data';
import { NeedsReviewScanResultStoreData } from 'common/types/store-data/needs-review-scan-result-data';
import { PermissionsStateStoreData } from 'common/types/store-data/permissions-state-store-data';
import { UnifiedScanResultStoreData } from 'common/types/store-data/unified-data-interface';
import { toolName } from 'content/strings/application';
import { TabStopRequirementActionMessageCreator } from 'DetailsView/actions/tab-stop-requirement-action-message-creator';
import { GetDetailsSwitcherNavConfiguration } from 'DetailsView/components/details-view-switcher-nav';
import { getCheckResolution, getFixResolution } from 'injected/adapters/resolution-creator';
import { filterNeedsReviewResults } from 'injected/analyzers/filter-results';
import { NotificationTextCreator } from 'injected/analyzers/notification-text-creator';
import { TabStopsDoneAnalyzingTracker } from 'injected/analyzers/tab-stops-done-analyzing-tracker';
import { TabStopsRequirementResultProcessor } from 'injected/analyzers/tab-stops-requirement-result-processor';
import { ClientStoreListener, TargetPageStoreData } from 'injected/client-store-listener';
import { ElementBasedViewModelCreator } from 'injected/element-based-view-model-creator';
import { FocusChangeHandler } from 'injected/focus-change-handler';
import { getDecoratedAxeNode } from 'injected/get-decorated-axe-node';
import { IframeDetector } from 'injected/iframe-detector';
import { isVisualizationEnabled } from 'injected/is-visualization-enabled';
import { ScanIncompleteWarningDetector } from 'injected/scan-incomplete-warning-detector';
import { TargetPageVisualizationUpdater } from 'injected/target-page-visualization-updater';
import { visualizationNeedsUpdate } from 'injected/visualization-needs-update';
import { VisualizationStateChangeHandler } from 'injected/visualization-state-change-handler';
import { GetVisualizationInstancesForTabStops } from 'injected/visualization/get-visualization-instances-for-tab-stops';
import { AxeInfo } from '../common/axe-info';
import { InspectConfigurationFactory } from '../common/configs/inspect-configuration-factory';
import { DateProvider } from '../common/date-provider';
import { TelemetryEventSource } from '../common/extension-telemetry-events';
import { HTMLElementUtils } from '../common/html-element-utils';
import { DevToolActionMessageCreator } from '../common/message-creators/dev-tool-action-message-creator';
import { InspectActionMessageCreator } from '../common/message-creators/inspect-action-message-creator';
import { PathSnippetActionMessageCreator } from '../common/message-creators/path-snippet-action-message-creator';
import { ScopingActionMessageCreator } from '../common/message-creators/scoping-action-message-creator';
import { UserConfigMessageCreator } from '../common/message-creators/user-config-message-creator';
import { NavigatorUtils } from '../common/navigator-utils';
import { StoreProxy } from '../common/store-proxy';
import { StoreNames } from '../common/stores/store-names';
import { TelemetryDataFactory } from '../common/telemetry-data-factory';
import { AssessmentStoreData } from '../common/types/store-data/assessment-result-data';
import { DevToolStoreData } from '../common/types/store-data/dev-tool-store-data';
import { FeatureFlagStoreData } from '../common/types/store-data/feature-flag-store-data';
import { InspectStoreData } from '../common/types/store-data/inspect-store-data';
import { PathSnippetStoreData } from '../common/types/store-data/path-snippet-store-data';
import { ScopingStoreData } from '../common/types/store-data/scoping-store-data';
import { TabStoreData } from '../common/types/store-data/tab-store-data';
import { UserConfigurationStoreData } from '../common/types/store-data/user-configuration-store';
import { VisualizationScanResultData } from '../common/types/store-data/visualization-scan-result-data';
import { VisualizationStoreData } from '../common/types/store-data/visualization-store-data';
import { generateUID } from '../common/uid-generator';
import { IssueFilingServiceProviderImpl } from '../issue-filing/issue-filing-service-provider-impl';
import { scan } from '../scanner/exposed-apis';
import { IssueFilingActionMessageCreator } from './../common/message-creators/issue-filing-action-message-creator';
import { ConvertScanResultsToUnifiedResults } from './adapters/scan-results-to-unified-results';
import { convertScanResultsToUnifiedRules } from './adapters/scan-results-to-unified-rules';
import { AnalyzerController } from './analyzer-controller';
import { AnalyzerStateUpdateHandler } from './analyzer-state-update-handler';
import { AnalyzerProvider } from './analyzers/analyzer-provider';
import { filterResultsByRules } from './analyzers/filter-results-by-rules';
import { UnifiedResultSender } from './analyzers/unified-result-sender';
import { DrawingInitiator } from './drawing-initiator';
import { FrameUrlController } from './frame-url-controller';
import { InspectController } from './inspect-controller';
import { MainWindowContext } from './main-window-context';
import { PathSnippetController } from './path-snippet-controller';
import { ScannerUtils } from './scanner-utils';
import { ScopingListener } from './scoping-listener';
import { SelectorMapHelper } from './selector-map-helper';
import { ShadowUtils } from './shadow-utils';
import { TargetPageActionMessageCreator } from './target-page-action-message-creator';
import { WindowInitializer } from './window-initializer';

export class MainWindowInitializer extends WindowInitializer {
    private analyzerController: AnalyzerController;
    private inspectController: InspectController;
    private pathSnippetController: PathSnippetController;
    private storeUpdateMessageHub: StoreUpdateMessageHub;
    private visualizationStoreProxy: StoreProxy<VisualizationStoreData>;
    private assessmentStoreProxy: StoreProxy<AssessmentStoreData>;
    private featureFlagStoreProxy: StoreProxy<FeatureFlagStoreData>;
    private userConfigStoreProxy: StoreProxy<UserConfigurationStoreData>;
    private inspectStoreProxy: StoreProxy<InspectStoreData>;
    private visualizationScanResultStoreProxy: StoreProxy<VisualizationScanResultData>;
    private scopingStoreProxy: StoreProxy<ScopingStoreData>;
    private tabStoreProxy: StoreProxy<TabStoreData>;
    private devToolStoreProxy: StoreProxy<DevToolStoreData>;
    private pathSnippetStoreProxy: StoreProxy<PathSnippetStoreData>;
    private unifiedScanResultStoreProxy: StoreProxy<UnifiedScanResultStoreData>;
    private cardSelectionStoreProxy: StoreProxy<CardSelectionStoreData>;
    private needsReviewScanResultStoreProxy: StoreProxy<NeedsReviewScanResultStoreData>;
    private needsReviewCardSelectionStoreProxy: StoreProxy<NeedsReviewCardSelectionStoreData>;
    private permissionsStateStoreProxy: StoreProxy<PermissionsStateStoreData>;

    public async initialize(logger: Logger): Promise<void> {
        const asyncInitializationSteps: Promise<void>[] = [];
        asyncInitializationSteps.push(super.initialize(logger));

        this.storeUpdateMessageHub = new StoreUpdateMessageHub(this.actionMessageDispatcher);
        this.browserAdapter.addListenerOnRuntimeMessage(
            this.storeUpdateMessageHub.handleBrowserMessage,
        );

        this.visualizationStoreProxy = new StoreProxy<VisualizationStoreData>(
            StoreNames[StoreNames.VisualizationStore],
            this.storeUpdateMessageHub,
        );
        this.scopingStoreProxy = new StoreProxy<ScopingStoreData>(
            StoreNames[StoreNames.ScopingPanelStateStore],
            this.storeUpdateMessageHub,
        );
        this.featureFlagStoreProxy = new StoreProxy<FeatureFlagStoreData>(
            StoreNames[StoreNames.FeatureFlagStore],
            this.storeUpdateMessageHub,
        );
        this.userConfigStoreProxy = new StoreProxy<UserConfigurationStoreData>(
            StoreNames[StoreNames.UserConfigurationStore],
            this.storeUpdateMessageHub,
        );
        this.visualizationScanResultStoreProxy = new StoreProxy<VisualizationScanResultData>(
            StoreNames[StoreNames.VisualizationScanResultStore],
            this.storeUpdateMessageHub,
        );
        this.assessmentStoreProxy = new StoreProxy<AssessmentStoreData>(
            StoreNames[StoreNames.AssessmentStore],
            this.storeUpdateMessageHub,
        );
        this.tabStoreProxy = new StoreProxy<TabStoreData>(
            StoreNames[StoreNames.TabStore],
            this.storeUpdateMessageHub,
        );
        this.devToolStoreProxy = new StoreProxy<DevToolStoreData>(
            StoreNames[StoreNames.DevToolsStore],
            this.storeUpdateMessageHub,
        );
        this.inspectStoreProxy = new StoreProxy<InspectStoreData>(
            StoreNames[StoreNames.InspectStore],
            this.storeUpdateMessageHub,
        );
        this.pathSnippetStoreProxy = new StoreProxy<PathSnippetStoreData>(
            StoreNames[StoreNames.PathSnippetStore],
            this.storeUpdateMessageHub,
        );
        this.unifiedScanResultStoreProxy = new StoreProxy<UnifiedScanResultStoreData>(
            StoreNames[StoreNames.UnifiedScanResultStore],
            this.storeUpdateMessageHub,
        );
        this.cardSelectionStoreProxy = new StoreProxy<CardSelectionStoreData>(
            StoreNames[StoreNames.CardSelectionStore],
            this.storeUpdateMessageHub,
        );
        this.needsReviewScanResultStoreProxy = new StoreProxy<NeedsReviewScanResultStoreData>(
            StoreNames[StoreNames.NeedsReviewScanResultStore],
            this.storeUpdateMessageHub,
        );
        this.needsReviewCardSelectionStoreProxy = new StoreProxy<NeedsReviewCardSelectionStoreData>(
            StoreNames[StoreNames.NeedsReviewCardSelectionStore],
            this.storeUpdateMessageHub,
        );
        this.permissionsStateStoreProxy = new StoreProxy<PermissionsStateStoreData>(
            StoreNames[StoreNames.PermissionsStateStore],
            this.storeUpdateMessageHub,
        );

        const telemetryDataFactory = new TelemetryDataFactory();
        const devToolActionMessageCreator = new DevToolActionMessageCreator(
            telemetryDataFactory,
            this.actionMessageDispatcher,
        );

        const targetPageActionMessageCreator = new TargetPageActionMessageCreator(
            telemetryDataFactory,
            this.actionMessageDispatcher,
        );
        const issueFilingActionMessageCreator = new IssueFilingActionMessageCreator(
            this.actionMessageDispatcher,
            telemetryDataFactory,
            TelemetryEventSource.TargetPage,
        );
        const tabStopRequirementActionMessageCreator = new TabStopRequirementActionMessageCreator(
            telemetryDataFactory,
            this.actionMessageDispatcher,
            TelemetryEventSource.TargetPage,
        );

        const userConfigMessageCreator = new UserConfigMessageCreator(
            this.actionMessageDispatcher,
            telemetryDataFactory,
        );

        const browserSpec = new NavigatorUtils(window.navigator, logger).getBrowserSpec();

        const toolData = createToolData(
            'axe-core',
            AxeInfo.Default.version,
            toolName,
            this.appDataAdapter.getVersion(),
            browserSpec,
        );

        MainWindowContext.initialize(
            this.devToolStoreProxy,
            this.userConfigStoreProxy,
            devToolActionMessageCreator,
            targetPageActionMessageCreator,
            issueFilingActionMessageCreator,
            userConfigMessageCreator,
            toolData,
            IssueFilingServiceProviderImpl,
        );

        const drawingInitiator = new DrawingInitiator(this.drawingController);
        const elementBasedViewModelCreator = new ElementBasedViewModelCreator(
            getDecoratedAxeNode,
            getCardSelectionViewData,
            isResultHighlightUnavailableWeb,
        );
        const selectorMapHelper = new SelectorMapHelper(
            Assessments,
            elementBasedViewModelCreator.getElementBasedViewModel,
            GetVisualizationInstancesForTabStops,
        );

        const storeHub = new ClientStoresHub<TargetPageStoreData>([
            this.visualizationStoreProxy,
            this.tabStoreProxy,
            this.visualizationScanResultStoreProxy,
            this.featureFlagStoreProxy,
            this.assessmentStoreProxy,
            this.userConfigStoreProxy,
            this.unifiedScanResultStoreProxy,
            this.cardSelectionStoreProxy,
            this.needsReviewScanResultStoreProxy,
            this.needsReviewCardSelectionStoreProxy,
            this.permissionsStateStoreProxy,
        ]);

        const clientStoreListener = new ClientStoreListener(storeHub);

        const focusChangeHandler = new FocusChangeHandler(
            targetPageActionMessageCreator,
            this.scrollingController,
        );

        const targetPageVisualizationUpdater = new TargetPageVisualizationUpdater(
            this.visualizationConfigurationFactory,
            selectorMapHelper,
            drawingInitiator,
            isVisualizationEnabled,
            visualizationNeedsUpdate,
        );

        const visualizationStateChangeHandler = new VisualizationStateChangeHandler(
            targetPageVisualizationUpdater.updateVisualization,
            this.visualizationConfigurationFactory,
        );

        clientStoreListener.registerOnReadyToExecuteVisualizationCallback(
            focusChangeHandler.handleFocusChangeWithStoreData,
        );
        clientStoreListener.registerOnReadyToExecuteVisualizationCallback(
            visualizationStateChangeHandler.updateVisualizationsWithStoreData,
        );

        const frameUrlController = new FrameUrlController(
            this.devToolStoreProxy,
            devToolActionMessageCreator,
            this.frameUrlFinder,
        );

        frameUrlController.listenToStore();

        const iframeDetector = new IframeDetector(document);
        const scanIncompleteWarningDetector = new ScanIncompleteWarningDetector(
            iframeDetector,
            this.permissionsStateStoreProxy,
        );

        const convertScanResultsToUnifiedResults = new ConvertScanResultsToUnifiedResults(
            generateUID,
            getFixResolution,
            getCheckResolution,
        );

        const notificationTextCreator = new NotificationTextCreator(scanIncompleteWarningDetector);

        const unifiedResultSender = new UnifiedResultSender(
            this.browserAdapter.sendMessageToFrames,
            convertScanResultsToUnifiedRules,
            toolData,
            convertScanResultsToUnifiedResults,
            scanIncompleteWarningDetector,
            notificationTextCreator,
            filterNeedsReviewResults,
        );

        const tabStopsDoneAnalyzingTracker = new TabStopsDoneAnalyzingTracker(
            tabStopRequirementActionMessageCreator,
        );

        const tabStopsRequirementResultProcessor = new TabStopsRequirementResultProcessor(
            this.tabStopRequirementRunner,
            tabStopRequirementActionMessageCreator,
            this.visualizationScanResultStoreProxy,
        );

        const analyzerProvider = new AnalyzerProvider(
            this.manualTabStopListener,
            tabStopsDoneAnalyzingTracker,
            tabStopsRequirementResultProcessor,
            this.scopingStoreProxy,
            this.browserAdapter.sendMessageToFrames,
            new ScannerUtils(scan, logger, generateUID),
            telemetryDataFactory,
            DateProvider.getCurrentDate,
            filterResultsByRules,
            unifiedResultSender.sendAutomatedChecksResults,
            unifiedResultSender.sendNeedsReviewResults,
            scanIncompleteWarningDetector,
            logger,
        );

        const analyzerStateUpdateHandler = new AnalyzerStateUpdateHandler(
            this.visualizationConfigurationFactory,
        );
        this.analyzerController = new AnalyzerController(
            this.visualizationStoreProxy,
            this.featureFlagStoreProxy,
            this.scopingStoreProxy,
            this.visualizationConfigurationFactory,
            analyzerProvider,
            analyzerStateUpdateHandler,
            Assessments,
            this.shadowInitializer,
            GetDetailsSwitcherNavConfiguration,
        );

        this.analyzerController.listenToStore();

        const htmlElementUtils = new HTMLElementUtils();
        const shadowUtils = new ShadowUtils(htmlElementUtils);
        const scopingListener = new ScopingListener(
            this.elementFinderByPosition,
            this.windowUtils,
            shadowUtils,
            document,
        );
        const inspectActionMessageCreator = new InspectActionMessageCreator(
            telemetryDataFactory,
            TelemetryEventSource.TargetPage,
            this.actionMessageDispatcher,
        );

        const scopingActionMessageCreator = new ScopingActionMessageCreator(
            telemetryDataFactory,
            TelemetryEventSource.TargetPage,
            this.actionMessageDispatcher,
        );

        const pathSnippetActionMessageCreator = new PathSnippetActionMessageCreator(
            this.actionMessageDispatcher,
        );

        this.inspectController = new InspectController(
            this.inspectStoreProxy,
            scopingListener,
            inspectActionMessageCreator.changeInspectMode,
            new InspectConfigurationFactory(scopingActionMessageCreator),
            targetPageActionMessageCreator.setHoveredOverSelector,
        );

        this.inspectController.listenToStore();

        this.pathSnippetController = new PathSnippetController(
            this.pathSnippetStoreProxy,
            this.elementFinderByPath,
            pathSnippetActionMessageCreator.addCorrespondingSnippet,
        );

        await this.pathSnippetController.listenToStore();

        await Promise.all(asyncInitializationSteps);
    }

    protected dispose(): void {
        super.dispose();
        this.browserAdapter.removeListenersOnMessage();
    }
}
