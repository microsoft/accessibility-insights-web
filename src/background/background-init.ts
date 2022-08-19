// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Assessments } from 'assessments/assessments';
import { IndexedDBDataKeys } from 'background/IndexedDBDataKeys';
import { PostMessageContentHandler } from 'background/post-message-content-handler';
import { PostMessageContentRepository } from 'background/post-message-content-repository';
import { TabContextManager } from 'background/tab-context-manager';
import { TabEventDistributor } from 'background/tab-event-distributor';
import { ConsoleTelemetryClient } from 'background/telemetry/console-telemetry-client';
import { DebugToolsTelemetryClient } from 'background/telemetry/debug-tools-telemetry-client';
import { SendingExceptionTelemetryListener } from 'background/telemetry/sending-exception-telemetry-listener';
import { createToolData } from 'common/application-properties-provider';
import { BackgroundBrowserEventManager } from 'common/browser-adapters/background-browser-event-manager';
import { BrowserAdapterFactory } from 'common/browser-adapters/browser-adapter-factory';
import { EventResponseFactory } from 'common/browser-adapters/event-response-factory';
import { WebVisualizationConfigurationFactory } from 'common/configs/web-visualization-configuration-factory';
import { TelemetryEventSource } from 'common/extension-telemetry-events';
import { ExceptionTelemetrySanitizer } from 'common/telemetry/exception-telemetry-sanitizer';
import { UrlParser } from 'common/url-parser';
import UAParser from 'ua-parser-js';
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
import { BackgroundMessageDistributor } from './background-message-distributor';
import { BrowserMessageBroadcasterFactory } from './browser-message-broadcaster-factory';
import { ExtensionDetailsViewController } from './extension-details-view-controller';
import { getAllPersistedData, getGlobalPersistedData } from './get-persisted-data';
import { GlobalContextFactory } from './global-context-factory';
import { KeyboardShortcutHandler } from './keyboard-shortcut-handler';
import { deprecatedStorageDataKeys, storageDataKeys } from './local-storage-data-keys';
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
    const persistData = true;

    const userAgentParser = new UAParser(window.navigator.userAgent);
    const browserAdapterFactory = new BrowserAdapterFactory(userAgentParser);
    const logger = createDefaultLogger();
    const promiseFactory = createDefaultPromiseFactory();

    const eventResponseFactory = new EventResponseFactory(promiseFactory);
    const browserEventManager = new BackgroundBrowserEventManager(
        promiseFactory,
        eventResponseFactory,
        logger,
    );
    const browserAdapter = browserAdapterFactory.makeFromUserAgent(browserEventManager);
    browserEventManager.preregisterBrowserListeners(browserAdapter.allSupportedEvents());

    // This only removes keys that are unused by current versions of the extension, so it's okay for it to race with everything else
    const cleanKeysFromStoragePromise = cleanKeysFromStorage(
        browserAdapter,
        deprecatedStorageDataKeys,
    );

    const urlValidator = new UrlValidator(browserAdapter);
    const indexedDBInstance: IndexedDBAPI = new IndexedDBUtil(getIndexedDBStore());
    const indexedDBDataKeysToFetch = [
        IndexedDBDataKeys.assessmentStore,
        IndexedDBDataKeys.userConfiguration,
    ];

    // These can run concurrently, both because they are read-only and because they use different types of underlying storage
    let persistedDataPromise;
    if (persistData) {
        persistedDataPromise = getAllPersistedData(indexedDBInstance);
    } else {
        persistedDataPromise = getGlobalPersistedData(indexedDBInstance, indexedDBDataKeysToFetch);
    }
    const userDataPromise = browserAdapter.getUserData(storageDataKeys);
    const persistedData = await persistedDataPromise;
    const userData = await userDataPromise;

    const assessmentsProvider = Assessments;
    const telemetryDataFactory = new TelemetryDataFactory();

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

    const telemetryClient = getTelemetryClient(applicationTelemetryDataFactory, [
        consoleTelemetryClient,
        debugToolsTelemetryClient,
    ]);

    const usageLogger = new UsageLogger(browserAdapter, DateProvider.getCurrentDate, logger);

    const telemetryEventHandler = new TelemetryEventHandler(telemetryClient);

    const telemetrySanitizer = new ExceptionTelemetrySanitizer(browserAdapter.getExtensionId());
    const exceptionTelemetryListener = new SendingExceptionTelemetryListener(
        telemetryEventHandler,
        TelemetryEventSource.Background,
        telemetrySanitizer,
    );
    exceptionTelemetryListener.initialize(logger);

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
        persistData,
    );
    telemetryLogger.initialize(globalContext.featureFlagsController);
    debugToolsTelemetryClient.initialize(globalContext.featureFlagsController);

    const telemetryStateListener = new TelemetryStateListener(
        globalContext.stores.userConfigurationStore,
        telemetryEventHandler,
    );
    telemetryStateListener.initialize();

    const messageBroadcasterFactory = new BrowserMessageBroadcasterFactory(browserAdapter, logger);

    const tabContextManager = new TabContextManager();

    const visualizationConfigurationFactory = new WebVisualizationConfigurationFactory();
    const notificationCreator = new NotificationCreator(
        browserAdapter,
        visualizationConfigurationFactory,
        logger,
    );

    const keyboardShortcutHandler = new KeyboardShortcutHandler(
        tabContextManager,
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

    const postMessageContentRepository = new PostMessageContentRepository(
        DateProvider.getCurrentDate,
    );

    const postMessageContentHandler = new PostMessageContentHandler(postMessageContentRepository);

    const messageDistributor = new BackgroundMessageDistributor(
        globalContext,
        tabContextManager,
        postMessageContentHandler,
        browserAdapter,
        eventResponseFactory,
    );
    messageDistributor.initialize();

    const targetTabController = new TargetTabController(
        browserAdapter,
        visualizationConfigurationFactory,
    );

    const detailsViewController = new ExtensionDetailsViewController(
        browserAdapter,
        persistedData.tabIdToDetailsViewMap ?? {},
        indexedDBInstance,
        tabContextManager.interpretMessageForTab,
        persistData,
    );
    await detailsViewController.initialize();

    const urlParser = new UrlParser();

    const tabContextFactory = new TabContextFactory(
        visualizationConfigurationFactory,
        telemetryEventHandler,
        targetTabController,
        notificationCreator,
        detailsViewController,
        browserAdapter,
        messageBroadcasterFactory,
        promiseFactory,
        logger,
        usageLogger,
        persistedData,
        indexedDBInstance,
        persistData,
        urlParser,
    );

    const targetPageController = new TargetPageController(
        tabContextManager,
        tabContextFactory,
        browserAdapter,
        logger,
        persistedData.knownTabIds ?? {},
        indexedDBInstance,
        persistData,
    );

    await targetPageController.initialize();

    const tabEventDistributor = new TabEventDistributor(
        browserAdapter,
        targetPageController,
        detailsViewController,
    );
    tabEventDistributor.initialize();

    window.insightsFeatureFlags = globalContext.featureFlagsController;
    window.insightsUserConfiguration = globalContext.userConfigurationController;

    await cleanKeysFromStoragePromise;
}

initialize()
    .then(() => console.log('Background initialization completed succesfully'))
    .catch((e: Error) => console.error('Background initialization failed: ', e));
