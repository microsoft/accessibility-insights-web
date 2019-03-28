// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { autobind } from '@uifabric/utilities';

import { InspectConfigurationFactory } from '../common/configs/inspect-configuration-factory';
import { DateProvider } from '../common/date-provider';
import { HTMLElementUtils } from '../common/html-element-utils';
import { BugActionMessageCreator } from '../common/message-creators/bug-action-message-creator';
import { DevToolActionMessageCreator } from '../common/message-creators/dev-tool-action-message-creator';
import { InspectActionMessageCreator } from '../common/message-creators/inspect-action-message-creator';
import { ScopingActionMessageCreator } from '../common/message-creators/scoping-action-message-creator';
import { StoreActionMessageCreatorFactory } from '../common/message-creators/store-action-message-creator-factory';
import { StoreProxy } from '../common/store-proxy';
import { StoreNames } from '../common/stores/store-names';
import { TelemetryDataFactory } from '../common/telemetry-data-factory';
import { TelemetryEventSource } from '../common/telemetry-events';
import { FeatureFlagStoreData } from '../common/types/store-data/feature-flag-store-data';
import { IAssessmentStoreData } from '../common/types/store-data/iassessment-result-data';
import { DevToolState } from '../common/types/store-data/idev-tool-state';
import { InspectStoreData } from '../common/types/store-data/inspect-store-data';
import { ITabStoreData } from '../common/types/store-data/itab-store-data';
import { IVisualizationScanResultData } from '../common/types/store-data/ivisualization-scan-result-data';
import { IVisualizationStoreData } from '../common/types/store-data/ivisualization-store-data';
import { IScopingStoreData } from '../common/types/store-data/scoping-store-data';
import { UserConfigurationStoreData } from '../common/types/store-data/user-configuration-store';
import { generateUID } from '../common/uid-generator';
import { scan } from '../scanner/exposed-apis';
import { Assessments } from './../assessments/assessments';
import { AnalyzerController } from './analyzer-controller';
import { AnalyzerStateUpdateHandler } from './analyzer-state-update-handler';
import { AnalyzerProvider } from './analyzers/analyzer-provider';
import { filterResultsByRules } from './analyzers/filter-results-by-rules';
import { ClientViewController } from './client-view-controller';
import { DrawingInitiator } from './drawing-initiator';
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
import { WindowInitializer } from './window-initializer';

export class MainWindowInitializer extends WindowInitializer {
    protected frameCommunicator: FrameCommunicator;
    private clientViewController: ClientViewController;
    private frameUrlSearchInitiator: FrameUrlSearchInitiator;
    private analyzerController: AnalyzerController;
    private inspectController: InspectController;
    private visualizationStoreProxy: StoreProxy<IVisualizationStoreData>;
    private assessmentStoreProxy: StoreProxy<IAssessmentStoreData>;
    private featureFlagStoreProxy: StoreProxy<FeatureFlagStoreData>;
    private userConfigStoreProxy: StoreProxy<UserConfigurationStoreData>;
    private inspectStoreProxy: StoreProxy<InspectStoreData>;
    private visualizationScanResultStoreProxy: StoreProxy<IVisualizationScanResultData>;
    private scopingStoreProxy: StoreProxy<IScopingStoreData>;
    private tabStoreProxy: StoreProxy<ITabStoreData>;
    private devToolStoreProxy: StoreProxy<DevToolState>;

    public async initialize(): Promise<void> {
        const asyncInitializationSteps: Promise<void>[] = [];
        asyncInitializationSteps.push(super.initialize());

        this.visualizationStoreProxy = new StoreProxy<IVisualizationStoreData>(
            StoreNames[StoreNames.VisualizationStore],
            this.clientChromeAdapter,
        );
        this.scopingStoreProxy = new StoreProxy<IScopingStoreData>(StoreNames[StoreNames.ScopingPanelStateStore], this.clientChromeAdapter);
        this.featureFlagStoreProxy = new StoreProxy<FeatureFlagStoreData>(
            StoreNames[StoreNames.FeatureFlagStore],
            this.clientChromeAdapter,
        );
        this.userConfigStoreProxy = new StoreProxy<UserConfigurationStoreData>(
            StoreNames[StoreNames.UserConfigurationStore],
            this.clientChromeAdapter,
        );
        this.visualizationScanResultStoreProxy = new StoreProxy<IVisualizationScanResultData>(
            StoreNames[StoreNames.VisualizationScanResultStore],
            this.clientChromeAdapter,
        );
        this.assessmentStoreProxy = new StoreProxy<IAssessmentStoreData>(StoreNames[StoreNames.AssessmentStore], this.clientChromeAdapter);
        this.tabStoreProxy = new StoreProxy<ITabStoreData>(StoreNames[StoreNames.TabStore], this.clientChromeAdapter);
        this.devToolStoreProxy = new StoreProxy<DevToolState>(StoreNames[StoreNames.DevToolsStore], this.clientChromeAdapter);
        this.inspectStoreProxy = new StoreProxy<InspectStoreData>(StoreNames[StoreNames.InspectStore], this.clientChromeAdapter);

        const storeActionMessageCreatorFactory = new StoreActionMessageCreatorFactory(this.clientChromeAdapter.sendMessageToFrames, null);

        const storeActionMessageCreator = storeActionMessageCreatorFactory.forInjected();
        storeActionMessageCreator.getAllStates();

        const telemetryDataFactory = new TelemetryDataFactory();
        const devToolActionMessageCreator = new DevToolActionMessageCreator(
            this.clientChromeAdapter.sendMessageToFrames,
            null,
            telemetryDataFactory,
        );
        const targetPageActionMessageCreator = new TargetPageActionMessageCreator(
            this.clientChromeAdapter.sendMessageToFrames,
            null,
            telemetryDataFactory,
        );
        const bugActionMessageCreator = new BugActionMessageCreator(
            this.clientChromeAdapter.sendMessageToFrames,
            null,
            telemetryDataFactory,
            TelemetryEventSource.TargetPage,
        );

        MainWindowContext.initialize(
            this.devToolStoreProxy,
            this.userConfigStoreProxy,
            devToolActionMessageCreator,
            targetPageActionMessageCreator,
            bugActionMessageCreator,
        );

        const drawingInitiator = new DrawingInitiator(this.drawingController);
        const selectorMapHelper = new SelectorMapHelper(this.visualizationScanResultStoreProxy, this.assessmentStoreProxy, Assessments);
        const frameUrlMessageDispatcher = new FrameUrlMessageDispatcher(
            devToolActionMessageCreator,
            this.frameUrlFinder,
            this.frameCommunicator,
        );
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
            DateProvider.getDate,
            this.visualizationConfigurationFactory,
            filterResultsByRules,
        );
        const analyzerStateUpdateHandler = new AnalyzerStateUpdateHandler(this.visualizationConfigurationFactory);
        this.analyzerController = new AnalyzerController(
            this.clientChromeAdapter.sendMessageToFrames,
            this.visualizationStoreProxy,
            this.featureFlagStoreProxy,
            this.scopingStoreProxy,
            this.tabStopsListener,
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
            this.clientChromeAdapter.sendMessageToFrames,
            null,
            telemetryDataFactory,
            TelemetryEventSource.TargetPage,
        );

        const scopingActionMessageCreator = new ScopingActionMessageCreator(
            this.clientChromeAdapter.sendMessageToFrames,
            null,
            telemetryDataFactory,
            TelemetryEventSource.TargetPage,
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
