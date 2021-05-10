// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AppInsights } from 'applicationinsights-js';
import { Assessments } from 'assessments/assessments';
import { PostMessageContentHandler } from 'background/post-message-content-handler';
import { PostMessageContentRepository } from 'background/post-message-content-repository';
import { ConsoleTelemetryClient } from 'background/telemetry/console-telemetry-client';
import { DebugToolsTelemetryClient } from 'background/telemetry/debug-tools-telemetry-client';
import { createToolData } from 'common/application-properties-provider';
import { BrowserAdapterFactory } from 'common/browser-adapters/browser-adapter-factory';
import { WebVisualizationConfigurationFactory } from 'common/configs/web-visualization-configuration-factory';
import { WindowUtils } from 'common/window-utils';
import * as UAParser from 'ua-parser-js';
import { AxeInfo } from '../common/axe-info';
import { DateProvider } from '../common/date-provider';
import { getIndexedDBStore } from '../common/indexedDB/get-indexeddb-store';
import { IndexedDBAPI, IndexedDBUtil } from '../common/indexedDB/indexedDB';
import { InsightsWindowExtensions } from '../common/insights-window-extensions';
import { createDefaultLogger } from '../common/logging/default-logger';
import { NavigatorUtils } from '../common/navigator-utils';
import { NotificationCreator } from '../common/notification-creator';
import { createDefaultPromiseFactory } from '../common/promises/promise-factory';
import { TelemetryDataFactory } from '../common/telemetry-data-factory';
import { UrlValidator } from '../common/url-validator';
import { title, toolName } from '../content/strings/application';
import { IssueFilingServiceProviderImpl } from '../issue-filing/issue-filing-service-provider-impl';
import { BrowserMessageBroadcasterFactory } from './browser-message-broadcaster-factory';
import { DevToolsListener } from './dev-tools-listener';
import { ExtensionDetailsViewController } from './extension-details-view-controller';
import { getPersistedData } from './get-persisted-data';
import { GlobalContextFactory } from './global-context-factory';
import { IndexedDBDataKeys } from './IndexedDBDataKeys';
import { KeyboardShortcutHandler } from './keyboard-shortcut-handler';
import { deprecatedStorageDataKeys, storageDataKeys } from './local-storage-data-keys';
import { MessageDistributor } from './message-distributor';
import { TabToContextMap } from './tab-context';
import { TabContextFactory } from './tab-context-factory';
import { TargetPageController } from './target-page-controller';
import { TargetTabController } from './target-tab-controller';
import {
    getApplicationTelemetryDataFactory,
    getTelemetryClient,
} from './telemetry/telemetry-client-provider';
import { TelemetryEventHandler } from './telemetry/telemetry-event-handler';
import { TelemetryLogger } from './telemetry/telemetry-logger';
import { TelemetryStateListener } from './telemetry/telemetry-state-listener';
import { UsageLogger } from './usage-logger';
import { cleanKeysFromStorage } from './user-stored-data-cleaner';

declare let window: Window & InsightsWindowExtensions;

async function initialize(): Promise<void> {
    const userAgentParser = new UAParser(window.navigator.userAgent);
    const browserAdapterFactory = new BrowserAdapterFactory(userAgentParser);
    const browserAdapter = browserAdapterFactory.makeFromUserAgent();

    // This only removes keys that are unused by current versions of the extension, so it's okay for it to race with everything else
    const cleanKeysFromStoragePromise = cleanKeysFromStorage(
        browserAdapter,
        deprecatedStorageDataKeys,
    );

    const windowUtils = new WindowUtils();

    const urlValidator = new UrlValidator(browserAdapter);
    const indexedDBInstance: IndexedDBAPI = new IndexedDBUtil(getIndexedDBStore());
    const indexedDBDataKeysToFetch = [
        IndexedDBDataKeys.assessmentStore,
        IndexedDBDataKeys.userConfiguration,
    ];

    // These can run concurrently, both because they are read-only and because they use different types of underlying storage
    const persistedDataPromise = getPersistedData(indexedDBInstance, indexedDBDataKeysToFetch);
    const userDataPromise = browserAdapter.getUserData(storageDataKeys);
    const persistedData = await persistedDataPromise;
    const userData = await userDataPromise;

    const assessmentsProvider = Assessments;
    const telemetryDataFactory = new TelemetryDataFactory();

    const logger = createDefaultLogger();
    const telemetryLogger = new TelemetryLogger(logger);

    const { installationData } = userData;

    const applicationTelemetryDataFactory = getApplicationTelemetryDataFactory(
        installationData,
        browserAdapter,
        browserAdapter,
        title,
    );

    const consoleTelemetryClient = new ConsoleTelemetryClient(
        applicationTelemetryDataFactory,
        telemetryLogger,
    );

    const debugToolsTelemetryClient = new DebugToolsTelemetryClient(
        browserAdapter,
        applicationTelemetryDataFactory,
    );
    debugToolsTelemetryClient.initialize();

    const telemetryClient = getTelemetryClient(applicationTelemetryDataFactory, AppInsights, [
        consoleTelemetryClient,
        debugToolsTelemetryClient,
    ]);

    const usageLogger = new UsageLogger(browserAdapter, DateProvider.getCurrentDate, logger);

    const telemetryEventHandler = new TelemetryEventHandler(telemetryClient);

    const browserSpec = new NavigatorUtils(window.navigator, logger).getBrowserSpec();

    const toolData = createToolData(
        'axe-core',
        AxeInfo.Default.version,
        toolName,
        browserAdapter.getVersion(),
        browserSpec,
    );

    const globalContext = await GlobalContextFactory.createContext(
        browserAdapter,
        telemetryEventHandler,
        userData,
        assessmentsProvider,
        telemetryDataFactory,
        indexedDBInstance,
        persistedData,
        IssueFilingServiceProviderImpl,
        toolData,
        browserAdapter,
        browserAdapter,
        logger,
    );
    telemetryLogger.initialize(globalContext.featureFlagsController);

    const telemetryStateListener = new TelemetryStateListener(
        globalContext.stores.userConfigurationStore,
        telemetryEventHandler,
    );
    telemetryStateListener.initialize();

    const messageBroadcasterFactory = new BrowserMessageBroadcasterFactory(browserAdapter, logger);
    const detailsViewController = new ExtensionDetailsViewController(browserAdapter);

    const tabToContextMap: TabToContextMap = {};

    const visualizationConfigurationFactory = new WebVisualizationConfigurationFactory();
    const notificationCreator = new NotificationCreator(
        browserAdapter,
        visualizationConfigurationFactory,
        logger,
    );

    const keyboardShortcutHandler = new KeyboardShortcutHandler(
        tabToContextMap,
        browserAdapter,
        urlValidator,
        notificationCreator,
        visualizationConfigurationFactory,
        telemetryDataFactory,
        globalContext.stores.userConfigurationStore,
        browserAdapter,
        logger,
        usageLogger,
    );
    keyboardShortcutHandler.initialize();

    const messageDistributor = new MessageDistributor(
        globalContext,
        tabToContextMap,
        browserAdapter,
        logger,
    );
    messageDistributor.initialize();

    const targetTabController = new TargetTabController(
        browserAdapter,
        visualizationConfigurationFactory,
    );

    const promiseFactory = createDefaultPromiseFactory();

    const tabContextFactory = new TabContextFactory(
        visualizationConfigurationFactory,
        telemetryEventHandler,
        targetTabController,
        notificationCreator,
        promiseFactory,
        logger,
        usageLogger,
        windowUtils,
    );

    const targetPageController = new TargetPageController(
        tabToContextMap,
        messageBroadcasterFactory,
        browserAdapter,
        detailsViewController,
        tabContextFactory,
        logger,
    );

    await targetPageController.initialize();

    const devToolsBackgroundListener = new DevToolsListener(tabToContextMap, browserAdapter);
    devToolsBackgroundListener.initialize();

    const postMessageContentRepository = new PostMessageContentRepository(
        DateProvider.getCurrentDate,
    );

    const postMessageContentHandler = new PostMessageContentHandler(
        postMessageContentRepository,
        browserAdapter,
    );

    postMessageContentHandler.initialize();

    window.insightsFeatureFlags = globalContext.featureFlagsController;
    window.insightsUserConfiguration = globalContext.userConfigurationController;

    await cleanKeysFromStoragePromise;
}

initialize()
    .then(() => console.log('Background initialization completed succesfully'))
    .catch((e: Error) => console.error('Background initialization failed: ', e));
