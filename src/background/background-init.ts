// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AppInsights } from 'applicationinsights-js';

import { Assessments } from '../assessments/assessments';
import { AxeInfo } from '../common/axe-info';
import { VisualizationConfigurationFactory } from '../common/configs/visualization-configuration-factory';
import { EnvironmentInfoProvider } from '../common/environment-info-provider';
import { IndexedDBAPI, IndexedDBUtil } from '../common/indexedDB/indexedDB';
import { InsightsFeatureFlags } from '../common/insights-feature-flags';
import { createDefaultLogger } from '../common/logging/default-logger';
import { NavigatorUtils } from '../common/navigator-utils';
import { NotificationCreator } from '../common/notification-creator';
import { TelemetryDataFactory } from '../common/telemetry-data-factory';
import { UrlValidator } from '../common/url-validator';
import { WindowUtils } from '../common/window-utils';
import { IssueFilingServiceProviderImpl } from '../issue-filing/issue-filing-service-provider-impl';
import { ChromeAdapter } from './browser-adapters/chrome-adapter';
import { ChromeCommandHandler } from './chrome-command-handler';
import { DetailsViewController } from './details-view-controller';
import { DevToolsListener } from './dev-tools-listener';
import { getPersistedData, PersistedData } from './get-persisted-data';
import { GlobalContextFactory } from './global-context-factory';
import { deprecatedStorageDataKeys, storageDataKeys } from './local-storage-data-keys';
import { MessageDistributor } from './message-distributor';
import { LocalStorageData } from './storage-data';
import { TabToContextMap } from './tab-context';
import { TabContextBroadcaster } from './tab-context-broadcaster';
import { TabContextFactory } from './tab-context-factory';
import { TabController } from './tab-controller';
import { TargetTabController } from './target-tab-controller';
import { getTelemetryClient } from './telemetry/telemetry-client-provider';
import { TelemetryEventHandler } from './telemetry/telemetry-event-handler';
import { TelemetryLogger } from './telemetry/telemetry-logger';
import { TelemetryStateListener } from './telemetry/telemetry-state-listener';
import { UserStoredDataCleaner } from './user-stored-data-cleaner';

declare var window: Window & InsightsFeatureFlags;
const chromeAdapter = new ChromeAdapter();
const urlValidator = new UrlValidator(chromeAdapter);
const backgroundInitCleaner = new UserStoredDataCleaner(chromeAdapter);

const indexedDBInstance: IndexedDBAPI = new IndexedDBUtil();

backgroundInitCleaner.cleanUserData(deprecatedStorageDataKeys);

// tslint:disable-next-line:no-floating-promises - top-level entry points are intentionally floating promises
getPersistedData(indexedDBInstance).then((persistedData: PersistedData) => {
    chromeAdapter.getUserData(storageDataKeys, (userData: LocalStorageData) => {
        const assessmentsProvider = Assessments;
        const windowUtils = new WindowUtils();
        const telemetryDataFactory = new TelemetryDataFactory();
        const telemetryLogger = new TelemetryLogger();

        const telemetryClient = getTelemetryClient(userData, chromeAdapter, telemetryLogger, AppInsights, chromeAdapter);

        const telemetryEventHandler = new TelemetryEventHandler(telemetryClient);

        const browserSpec = new NavigatorUtils(window.navigator).getBrowserSpec();
        const environmentInfoProvider = new EnvironmentInfoProvider(chromeAdapter.extensionVersion, browserSpec, AxeInfo.Default.version);

        const globalContext = GlobalContextFactory.createContext(
            chromeAdapter,
            telemetryEventHandler,
            userData,
            assessmentsProvider,
            telemetryDataFactory,
            indexedDBInstance,
            persistedData,
            IssueFilingServiceProviderImpl,
            environmentInfoProvider.getEnvironmentInfo(),
            chromeAdapter,
            chromeAdapter,
        );
        telemetryLogger.initialize(globalContext.featureFlagsController);

        const telemetryStateListener = new TelemetryStateListener(globalContext.stores.userConfigurationStore, telemetryEventHandler);
        telemetryStateListener.initialize();

        const broadcaster = new TabContextBroadcaster(chromeAdapter.sendMessageToFramesAndTab);
        const detailsViewController = new DetailsViewController(chromeAdapter, chromeAdapter);

        const tabToContextMap: TabToContextMap = {};

        const visualizationConfigurationFactory = new VisualizationConfigurationFactory();
        const notificationCreator = new NotificationCreator(chromeAdapter, chromeAdapter, visualizationConfigurationFactory);

        const chromeCommandHandler = new ChromeCommandHandler(
            tabToContextMap,
            chromeAdapter,
            urlValidator,
            notificationCreator,
            visualizationConfigurationFactory,
            telemetryDataFactory,
            globalContext.stores.userConfigurationStore,
            chromeAdapter,
        );
        chromeCommandHandler.initialize();

        const messageDistributor = new MessageDistributor(globalContext, tabToContextMap, chromeAdapter);
        messageDistributor.initialize();

        const targetTabController = new TargetTabController(chromeAdapter, visualizationConfigurationFactory);

        const tabContextFactory = new TabContextFactory(
            visualizationConfigurationFactory,
            telemetryEventHandler,
            windowUtils,
            targetTabController,
            globalContext.stores.assessmentStore,
            assessmentsProvider,
        );

        const clientHandler = new TabController(
            tabToContextMap,
            broadcaster,
            chromeAdapter,
            chromeAdapter,
            chromeAdapter,
            chromeAdapter,
            detailsViewController,
            tabContextFactory,
            createDefaultLogger(),
        );

        clientHandler.initialize();

        const devToolsBackgroundListener = new DevToolsListener(tabToContextMap, chromeAdapter);
        devToolsBackgroundListener.initialize();

        window.insightsFeatureFlags = globalContext.featureFlagsController;
    });
});
