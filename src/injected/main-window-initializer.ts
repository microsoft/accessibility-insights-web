// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Assessments } from 'assessments/assessments';
import { EnumHelper } from 'common/enum-helper';
import { BaseClientStoresHub } from 'common/stores/base-client-stores-hub';
import { VisualizationType } from 'common/types/visualization-type';
import { ClientStoreListener, TargetPageStoreData } from 'injected/client-store-listener';
import { FocusChangeHandler } from 'injected/focus-change-handler';
import { isVisualizationEnabled } from 'injected/is-visualization-enabled';
import { TargetPageVisualizationUpdater } from 'injected/target-page-visualization-updater';
import { visualizationNeedsUpdate } from 'injected/visualization-needs-update';
import { VisualizationStateChangeHandler } from 'injected/visualization-state-change-handler';

import { AxeInfo } from '../common/axe-info';
import { InspectConfigurationFactory } from '../common/configs/inspect-configuration-factory';
import { DateProvider } from '../common/date-provider';
import { EnvironmentInfoProvider } from '../common/environment-info-provider';
import { TelemetryEventSource } from '../common/extension-telemetry-events';
import { HTMLElementUtils } from '../common/html-element-utils';
import { ActionMessageDispatcher } from '../common/message-creators/action-message-dispatcher';
import { DevToolActionMessageCreator } from '../common/message-creators/dev-tool-action-message-creator';
import { InspectActionMessageCreator } from '../common/message-creators/inspect-action-message-creator';
import { PathSnippetActionMessageCreator } from '../common/message-creators/path-snippet-action-message-creator';
import { ScopingActionMessageCreator } from '../common/message-creators/scoping-action-message-creator';
import { StoreActionMessageCreatorFactory } from '../common/message-creators/store-action-message-creator-factory';
import { UserConfigMessageCreator } from '../common/message-creators/user-config-message-creator';
import { NavigatorUtils } from '../common/navigator-utils';
import { StoreProxy } from '../common/store-proxy';
import { StoreNames } from '../common/stores/store-names';
import { TelemetryDataFactory } from '../common/telemetry-data-factory';
import { AssessmentStoreData } from '../common/types/store-data/assessment-result-data';
import { FeatureFlagStoreData } from '../common/types/store-data/feature-flag-store-data';
import { DevToolState } from '../common/types/store-data/idev-tool-state';
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
import { convertScanResultsToUnifiedResults } from './adapters/scan-results-to-unified-results';
import { convertScanResultsToUnifiedRules } from './adapters/scan-results-to-unified-rules';
import { AnalyzerController } from './analyzer-controller';
import { AnalyzerStateUpdateHandler } from './analyzer-state-update-handler';
import { AnalyzerProvider } from './analyzers/analyzer-provider';
import { filterResultsByRules } from './analyzers/filter-results-by-rules';
import { UnifiedResultSender } from './analyzers/unified-result-sender';
import { DrawingInitiator } from './drawing-initiator';
import { FrameUrlMessageDispatcher } from './frame-url-message-dispatcher';
import { FrameUrlSearchInitiator } from './frame-url-search-initiator';
import { FrameCommunicator } from './frameCommunicators/frame-communicator';
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
    protected frameCommunicator: FrameCommunicator;
    private frameUrlSearchInitiator: FrameUrlSearchInitiator;
    private analyzerController: AnalyzerController;
    private inspectController: InspectController;
    private pathSnippetController: PathSnippetController;
    private visualizationStoreProxy: StoreProxy<VisualizationStoreData>;
    private assessmentStoreProxy: StoreProxy<AssessmentStoreData>;
    private featureFlagStoreProxy: StoreProxy<FeatureFlagStoreData>;
    private userConfigStoreProxy: StoreProxy<UserConfigurationStoreData>;
    private inspectStoreProxy: StoreProxy<InspectStoreData>;
    private visualizationScanResultStoreProxy: StoreProxy<VisualizationScanResultData>;
    private scopingStoreProxy: StoreProxy<ScopingStoreData>;
    private tabStoreProxy: StoreProxy<TabStoreData>;
    private devToolStoreProxy: StoreProxy<DevToolState>;
    private pathSnippetStoreProxy: StoreProxy<PathSnippetStoreData>;

    public async initialize(): Promise<void> {
        const asyncInitializationSteps: Promise<void>[] = [];
        asyncInitializationSteps.push(super.initialize());

        this.visualizationStoreProxy = new StoreProxy<VisualizationStoreData>(
            StoreNames[StoreNames.VisualizationStore],
            this.browserAdapter,
        );
        this.scopingStoreProxy = new StoreProxy<ScopingStoreData>(StoreNames[StoreNames.ScopingPanelStateStore], this.browserAdapter);
        this.featureFlagStoreProxy = new StoreProxy<FeatureFlagStoreData>(StoreNames[StoreNames.FeatureFlagStore], this.browserAdapter);
        this.userConfigStoreProxy = new StoreProxy<UserConfigurationStoreData>(
            StoreNames[StoreNames.UserConfigurationStore],
            this.browserAdapter,
        );
        this.visualizationScanResultStoreProxy = new StoreProxy<VisualizationScanResultData>(
            StoreNames[StoreNames.VisualizationScanResultStore],
            this.browserAdapter,
        );
        this.assessmentStoreProxy = new StoreProxy<AssessmentStoreData>(StoreNames[StoreNames.AssessmentStore], this.browserAdapter);
        this.tabStoreProxy = new StoreProxy<TabStoreData>(StoreNames[StoreNames.TabStore], this.browserAdapter);
        this.devToolStoreProxy = new StoreProxy<DevToolState>(StoreNames[StoreNames.DevToolsStore], this.browserAdapter);
        this.inspectStoreProxy = new StoreProxy<InspectStoreData>(StoreNames[StoreNames.InspectStore], this.browserAdapter);
        this.pathSnippetStoreProxy = new StoreProxy<PathSnippetStoreData>(StoreNames[StoreNames.PathSnippetStore], this.browserAdapter);

        const actionMessageDispatcher = new ActionMessageDispatcher(this.browserAdapter.sendMessageToFrames, null);

        const storeActionMessageCreatorFactory = new StoreActionMessageCreatorFactory(actionMessageDispatcher);

        const storeActionMessageCreator = storeActionMessageCreatorFactory.fromStores([
            this.visualizationStoreProxy,
            this.scopingStoreProxy,
            this.featureFlagStoreProxy,
            this.userConfigStoreProxy,
            this.visualizationScanResultStoreProxy,
            this.assessmentStoreProxy,
            this.tabStoreProxy,
            this.devToolStoreProxy,
            this.inspectStoreProxy,
            this.pathSnippetStoreProxy,
        ]);
        storeActionMessageCreator.getAllStates();

        const telemetryDataFactory = new TelemetryDataFactory();
        const devToolActionMessageCreator = new DevToolActionMessageCreator(telemetryDataFactory, actionMessageDispatcher);

        const targetPageActionMessageCreator = new TargetPageActionMessageCreator(telemetryDataFactory, actionMessageDispatcher);
        const issueFilingActionMessageCreator = new IssueFilingActionMessageCreator(
            actionMessageDispatcher,
            telemetryDataFactory,
            TelemetryEventSource.TargetPage,
        );

        const userConfigMessageCreator = new UserConfigMessageCreator(actionMessageDispatcher);

        const browserSpec = new NavigatorUtils(window.navigator).getBrowserSpec();

        const environmentInfoProvider = new EnvironmentInfoProvider(this.appDataAdapter.getVersion(), browserSpec, AxeInfo.Default.version);

        MainWindowContext.initialize(
            this.devToolStoreProxy,
            this.userConfigStoreProxy,
            devToolActionMessageCreator,
            targetPageActionMessageCreator,
            issueFilingActionMessageCreator,
            userConfigMessageCreator,
            environmentInfoProvider,
            IssueFilingServiceProviderImpl,
        );

        const drawingInitiator = new DrawingInitiator(this.drawingController);
        const selectorMapHelper = new SelectorMapHelper(Assessments);
        const frameUrlMessageDispatcher = new FrameUrlMessageDispatcher(devToolActionMessageCreator, this.frameCommunicator);
        frameUrlMessageDispatcher.initialize();

        const storeHub = new BaseClientStoresHub<TargetPageStoreData>([
            this.visualizationStoreProxy,
            this.tabStoreProxy,
            this.visualizationScanResultStoreProxy,
            this.featureFlagStoreProxy,
            this.assessmentStoreProxy,
            this.userConfigStoreProxy,
        ]);

        const clientStoreListener = new ClientStoreListener(storeHub);

        const focusChangeHandler = new FocusChangeHandler(targetPageActionMessageCreator, this.scrollingController);

        const targetPageVisualizationUpdater = new TargetPageVisualizationUpdater(
            this.visualizationConfigurationFactory,
            selectorMapHelper,
            drawingInitiator,
            isVisualizationEnabled,
            visualizationNeedsUpdate,
        );

        const visualizationStateChangeHandler = new VisualizationStateChangeHandler(
            EnumHelper.getNumericValues(VisualizationType),
            targetPageVisualizationUpdater.updateVisualization,
            Assessments,
        );

        clientStoreListener.registerOnReadyToExecuteVisualizationCallback(focusChangeHandler.handleFocusChangeWithStoreData);
        clientStoreListener.registerOnReadyToExecuteVisualizationCallback(
            visualizationStateChangeHandler.updateVisualizationsWithStoreData,
        );

        this.frameUrlSearchInitiator = new FrameUrlSearchInitiator(this.devToolStoreProxy, this.frameUrlFinder);

        this.frameUrlSearchInitiator.listenToStore();

        const unifiedResultSender = new UnifiedResultSender(
            this.browserAdapter.sendMessageToFrames,
            convertScanResultsToUnifiedResults,
            convertScanResultsToUnifiedRules,
            environmentInfoProvider,
            generateUID,
        );

        const analyzerProvider = new AnalyzerProvider(
            this.tabStopsListener,
            this.scopingStoreProxy,
            this.browserAdapter.sendMessageToFrames,
            new ScannerUtils(scan, generateUID),
            telemetryDataFactory,
            DateProvider.getCurrentDate,
            this.visualizationConfigurationFactory,
            filterResultsByRules,
            unifiedResultSender.sendResults,
        );

        const analyzerStateUpdateHandler = new AnalyzerStateUpdateHandler(this.visualizationConfigurationFactory);
        this.analyzerController = new AnalyzerController(
            this.visualizationStoreProxy,
            this.featureFlagStoreProxy,
            this.scopingStoreProxy,
            this.visualizationConfigurationFactory,
            analyzerProvider,
            analyzerStateUpdateHandler,
            Assessments,
        );

        this.analyzerController.listenToStore();

        const htmlElementUtils = new HTMLElementUtils();
        const shadowUtils = new ShadowUtils(htmlElementUtils);
        const scopingListener = new ScopingListener(this.elementFinderByPosition, this.windowUtils, shadowUtils, document);
        const inspectActionMessageCreator = new InspectActionMessageCreator(
            telemetryDataFactory,
            TelemetryEventSource.TargetPage,
            actionMessageDispatcher,
        );

        const scopingActionMessageCreator = new ScopingActionMessageCreator(
            telemetryDataFactory,
            TelemetryEventSource.TargetPage,
            actionMessageDispatcher,
        );

        const pathSnippetActionMessageCreator = new PathSnippetActionMessageCreator(actionMessageDispatcher);

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

        this.pathSnippetController.listenToStore();

        await Promise.all(asyncInitializationSteps);
    }

    protected dispose(): void {
        super.dispose();

        this.frameCommunicator.dispose();
        this.tabStoreProxy.dispose();
        this.visualizationScanResultStoreProxy.dispose();
        this.visualizationStoreProxy.dispose();
        this.devToolStoreProxy.dispose();
    }
}
