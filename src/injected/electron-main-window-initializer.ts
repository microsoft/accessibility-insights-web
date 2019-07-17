// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { autobind } from '@uifabric/utilities';

import { Assessments } from '../assessments/assessments';
import { AxeInfo } from '../common/axe-info';
import { InspectConfigurationFactory } from '../common/configs/inspect-configuration-factory';
import { DateProvider } from '../common/date-provider';
import { EnvironmentInfoProvider } from '../common/environment-info-provider';
import { HTMLElementUtils } from '../common/html-element-utils';
import { ActionMessageDispatcher } from '../common/message-creators/action-message-dispatcher';
import { DevToolActionMessageCreator } from '../common/message-creators/dev-tool-action-message-creator';
import { InspectActionMessageCreator } from '../common/message-creators/inspect-action-message-creator';
import { ScopingActionMessageCreator } from '../common/message-creators/scoping-action-message-creator';
import { StoreActionMessageCreatorFactory } from '../common/message-creators/store-action-message-creator-factory';
import { UserConfigMessageCreator } from '../common/message-creators/user-config-message-creator';
import { NavigatorUtils } from '../common/navigator-utils';
import { StoreProxy } from '../common/store-proxy';
import { StoreNames } from '../common/stores/store-names';
import { TelemetryDataFactory } from '../common/telemetry-data-factory';
import { TelemetryEventSource } from '../common/telemetry-events';
import { AssessmentStoreData } from '../common/types/store-data/assessment-result-data';
import { FeatureFlagStoreData } from '../common/types/store-data/feature-flag-store-data';
import { DevToolState } from '../common/types/store-data/idev-tool-state';
import { InspectStoreData } from '../common/types/store-data/inspect-store-data';
import { ScopingStoreData } from '../common/types/store-data/scoping-store-data';
import { TabStoreData } from '../common/types/store-data/tab-store-data';
import { UserConfigurationStoreData } from '../common/types/store-data/user-configuration-store';
import { VisualizationScanResultData } from '../common/types/store-data/visualization-scan-result-data';
import { VisualizationStoreData } from '../common/types/store-data/visualization-store-data';
import { generateUID } from '../common/uid-generator';
import { IssueFilingServiceProviderImpl } from '../issue-filing/issue-filing-service-provider-impl';
import { scan } from '../scanner/exposed-apis';
import { IssueFilingActionMessageCreator } from './../common/message-creators/issue-filing-action-message-creator';
import { AnalyzerController } from './analyzer-controller';
import { AnalyzerStateUpdateHandler } from './analyzer-state-update-handler';
import { AnalyzerProvider } from './analyzers/analyzer-provider';
import { filterResultsByRules } from './analyzers/filter-results-by-rules';
import { ClientViewController } from './client-view-controller';
import { DrawingInitiator } from './drawing-initiator';
import { ElectronWindowInitializer } from './electron-window-initializer';
import { FrameUrlMessageDispatcher } from './frame-url-message-dispatcher';
import { FrameUrlSearchInitiator } from './frame-url-search-initiator';
import { FrameCommunicator } from './frameCommunicators/frame-communicator';
import { InspectController } from './inspect-controller';
import { MainWindowContext } from './main-window-context';
import { ScannerUtils } from './scanner-utils';
import { ScopingListener } from './scoping-listener';
import { SelectorMapHelper } from './selector-map-helper';
import { ShadowUtils } from './shadow-utils';
import { TargetPageActionMessageCreator } from './target-page-action-message-creator';

export class ElectronMainWindowInitializer extends ElectronWindowInitializer {
    protected frameCommunicator: FrameCommunicator;
    private clientViewController: ClientViewController;
    private frameUrlSearchInitiator: FrameUrlSearchInitiator;
    private analyzerController: AnalyzerController;
    private inspectController: InspectController;
    private visualizationStoreProxy: StoreProxy<VisualizationStoreData>;
    private assessmentStoreProxy: StoreProxy<AssessmentStoreData>;
    private featureFlagStoreProxy: StoreProxy<FeatureFlagStoreData>;
    private userConfigStoreProxy: StoreProxy<UserConfigurationStoreData>;
    private inspectStoreProxy: StoreProxy<InspectStoreData>;
    private visualizationScanResultStoreProxy: StoreProxy<VisualizationScanResultData>;
    private scopingStoreProxy: StoreProxy<ScopingStoreData>;
    private tabStoreProxy: StoreProxy<TabStoreData>;
    private devToolStoreProxy: StoreProxy<DevToolState>;

    public async initialize(): Promise<void> {
        const asyncInitializationSteps: Promise<void>[] = [];
        asyncInitializationSteps.push(super.initialize());

        this.visualizationStoreProxy = new StoreProxy<VisualizationStoreData>(
            StoreNames[StoreNames.VisualizationStore],
            this.clientChromeAdapter,
        );
        this.scopingStoreProxy = new StoreProxy<ScopingStoreData>(StoreNames[StoreNames.ScopingPanelStateStore], this.clientChromeAdapter);
        this.featureFlagStoreProxy = new StoreProxy<FeatureFlagStoreData>(
            StoreNames[StoreNames.FeatureFlagStore],
            this.clientChromeAdapter,
        );
        this.userConfigStoreProxy = new StoreProxy<UserConfigurationStoreData>(
            StoreNames[StoreNames.UserConfigurationStore],
            this.clientChromeAdapter,
        );
        this.visualizationScanResultStoreProxy = new StoreProxy<VisualizationScanResultData>(
            StoreNames[StoreNames.VisualizationScanResultStore],
            this.clientChromeAdapter,
        );
        this.assessmentStoreProxy = new StoreProxy<AssessmentStoreData>(StoreNames[StoreNames.AssessmentStore], this.clientChromeAdapter);
        this.tabStoreProxy = new StoreProxy<TabStoreData>(StoreNames[StoreNames.TabStore], this.clientChromeAdapter);
        this.devToolStoreProxy = new StoreProxy<DevToolState>(StoreNames[StoreNames.DevToolsStore], this.clientChromeAdapter);
        this.inspectStoreProxy = new StoreProxy<InspectStoreData>(StoreNames[StoreNames.InspectStore], this.clientChromeAdapter);

        // TODO hardcoding tab id = 1 to match getTab "implementation" on electron adapter. Need to change for proper implementation later.
        const actionMessageDispatcher = new ActionMessageDispatcher(this.clientChromeAdapter.sendMessageToFrames, 1);

        const storeActionMessageCreatorFactory = new StoreActionMessageCreatorFactory(actionMessageDispatcher);

        const storeActionMessageCreator = storeActionMessageCreatorFactory.forInjected();
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

        const environmentInfoProvider = new EnvironmentInfoProvider(
            this.clientChromeAdapter.extensionVersion,
            browserSpec,
            AxeInfo.Default.version,
        );

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
        const selectorMapHelper = new SelectorMapHelper(this.visualizationScanResultStoreProxy, this.assessmentStoreProxy, Assessments);
        const frameUrlMessageDispatcher = new FrameUrlMessageDispatcher(devToolActionMessageCreator, this.frameCommunicator);
        frameUrlMessageDispatcher.initialize();

        this.clientViewController = new ClientViewController(
            this.visualizationStoreProxy,
            this.visualizationScanResultStoreProxy,
            drawingInitiator,
            this.scrollingController,
            this.visualizationConfigurationFactory,
            this.featureFlagStoreProxy,
            this.assessmentStoreProxy,
            this.tabStoreProxy,
            this.userConfigStoreProxy,
            selectorMapHelper,
            targetPageActionMessageCreator,
        );

        this.clientViewController.initialize();

        this.frameUrlSearchInitiator = new FrameUrlSearchInitiator(this.devToolStoreProxy, this.frameUrlFinder);

        this.frameUrlSearchInitiator.listenToStore();

        const analyzerProvider = new AnalyzerProvider(
            this.tabStopsListener,
            this.scopingStoreProxy,
            this.clientChromeAdapter.sendMessageToFrames,
            new ScannerUtils(scan, generateUID),
            telemetryDataFactory,
            DateProvider.getCurrentDate,
            this.visualizationConfigurationFactory,
            filterResultsByRules,
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

        this.inspectController = new InspectController(
            this.inspectStoreProxy,
            scopingListener,
            inspectActionMessageCreator.changeInspectMode,
            new InspectConfigurationFactory(scopingActionMessageCreator),
            targetPageActionMessageCreator.setHoveredOverSelector,
        );

        this.inspectController.listenToStore();

        await Promise.all(asyncInitializationSteps);
    }

    @autobind
    protected dispose(): void {
        super.dispose();
        this.frameCommunicator.dispose();
        this.tabStoreProxy.dispose();
        this.visualizationScanResultStoreProxy.dispose();
        this.visualizationStoreProxy.dispose();
        this.devToolStoreProxy.dispose();
    }
}
