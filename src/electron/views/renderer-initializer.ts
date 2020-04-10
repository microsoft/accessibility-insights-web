// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AppInsights } from 'applicationinsights-js';
import axios from 'axios';
import { CardSelectionActionCreator } from 'background/actions/card-selection-action-creator';
import { CardSelectionActions } from 'background/actions/card-selection-actions';
import { ContentActions } from 'background/actions/content-actions';
import { DetailsViewActionCreator } from 'background/actions/details-view-action-creator';
import { DetailsViewActions } from 'background/actions/details-view-actions';
import { FeatureFlagActions } from 'background/actions/feature-flag-actions';
import { PreviewFeaturesActions } from 'background/actions/preview-features-actions';
import { SidePanelActions } from 'background/actions/side-panel-actions';
import { UnifiedScanResultActions } from 'background/actions/unified-scan-result-actions';
import { FeatureFlagsController } from 'background/feature-flags-controller';
import { FeatureFlagsActionCreator } from 'background/global-action-creators/feature-flags-action-creator';
import { registerUserConfigurationMessageCallback } from 'background/global-action-creators/registrar/register-user-configuration-message-callbacks';
import { UserConfigurationActionCreator } from 'background/global-action-creators/user-configuration-action-creator';
import { Interpreter } from 'background/interpreter';
import { CardSelectionStore } from 'background/stores/card-selection-store';
import { DetailsViewStore } from 'background/stores/details-view-store';
import { FeatureFlagStore } from 'background/stores/global/feature-flag-store';
import { UnifiedScanResultStore } from 'background/stores/unified-scan-result-store';
import { ConsoleTelemetryClient } from 'background/telemetry/console-telemetry-client';
import { UserConfigurationController } from 'background/user-configuration-controller';
import { provideBlob } from 'common/blob-provider';
import { onlyHighlightingSupported } from 'common/components/cards/card-interaction-support';
import { ExpandCollapseVisualHelperModifierButtons } from 'common/components/cards/cards-visualization-modifier-buttons';
import { CardsCollapsibleControl } from 'common/components/cards/collapsible-component-cards';
import { FixInstructionProcessor } from 'common/components/fix-instruction-processor';
import { getPropertyConfiguration } from 'common/configs/unified-result-property-configurations';
import { DateProvider } from 'common/date-provider';
import { DocumentManipulator } from 'common/document-manipulator';
import { DropdownClickHandler } from 'common/dropdown-click-handler';
import { TelemetryEventSource } from 'common/extension-telemetry-events';
import { FeatureFlagDefaultsHelper } from 'common/feature-flag-defaults-helper';
import { FileURLProvider } from 'common/file-url-provider';
import { getCardSelectionViewData } from 'common/get-card-selection-view-data';
import { GetGuidanceTagsFromGuidanceLinks } from 'common/get-guidance-tags-from-guidance-links';
import { createDefaultLogger } from 'common/logging/default-logger';
import { CardSelectionMessageCreator } from 'common/message-creators/card-selection-message-creator';
import { DropdownActionMessageCreator } from 'common/message-creators/dropdown-action-message-creator';
import { UserConfigMessageCreator } from 'common/message-creators/user-config-message-creator';
import { getCardViewData } from 'common/rule-based-view-model-provider';
import { TelemetryDataFactory } from 'common/telemetry-data-factory';
import { WindowUtils } from 'common/window-utils';
import { DetailsViewActionMessageCreator } from 'DetailsView/actions/details-view-action-message-creator';
import { CardsViewDeps } from 'DetailsView/components/cards-view';
import { ipcRenderer, remote } from 'electron';
import { DirectActionMessageDispatcher } from 'electron/adapters/direct-action-message-dispatcher';
import { NullDetailsViewController } from 'electron/adapters/null-details-view-controller';
import { NullStoreActionMessageCreator } from 'electron/adapters/null-store-action-message-creator';
import { createGetToolDataDelegate } from 'electron/common/application-properties-provider';
import { getAllFeatureFlagDetailsUnified } from 'electron/common/unified-feature-flags';
import { ScanActionCreator } from 'electron/flux/action-creator/scan-action-creator';
import { WindowFrameActionCreator } from 'electron/flux/action-creator/window-frame-action-creator';
import { WindowStateActionCreator } from 'electron/flux/action-creator/window-state-action-creator';
import { ScanActions } from 'electron/flux/action/scan-actions';
import { WindowFrameActions } from 'electron/flux/action/window-frame-actions';
import { WindowStateActions } from 'electron/flux/action/window-state-actions';
import { ScanStore } from 'electron/flux/store/scan-store';
import { WindowStateStore } from 'electron/flux/store/window-state-store';
import { IPC_MAIN_WINDOW_INITIALIZED_CHANNEL_NAME } from 'electron/ipc/ipc-channel-names';
import { IpcMessageReceiver } from 'electron/ipc/ipc-message-receiver';
import { createDeviceConfigFetcher } from 'electron/platform/android/device-config-fetcher';
import { createScanResultsFetcher } from 'electron/platform/android/fetch-scan-results';
import { ScanController } from 'electron/platform/android/scan-controller';
import { createDefaultBuilder } from 'electron/platform/android/unified-result-builder';
import { UnifiedSettingsProvider } from 'electron/settings/unified-settings-provider';
import { UnifiedReportSectionFactory } from 'electron/views/report/unified-report-section-factory';
import { RootContainerState } from 'electron/views/root-container/components/root-container';
import { PlatformInfo } from 'electron/window-management/platform-info';
import { WindowFrameListener } from 'electron/window-management/window-frame-listener';
import { WindowFrameUpdater } from 'electron/window-management/window-frame-updater';
import { loadTheme, setFocusVisibility } from 'office-ui-fabric-react';
import * as ReactDOM from 'react-dom';
import { getDefaultAddListenerForCollapsibleSection } from 'reports/components/report-sections/collapsible-script-provider';
import { ReactStaticRenderer } from 'reports/react-static-renderer';
import { ReportGenerator } from 'reports/report-generator';
import { ReportHtmlGenerator } from 'reports/report-html-generator';
import { ReportNameGenerator } from 'reports/report-name-generator';

import { UserConfigurationActions } from '../../background/actions/user-configuration-actions';
import { getPersistedData, PersistedData } from '../../background/get-persisted-data';
import { IndexedDBDataKeys } from '../../background/IndexedDBDataKeys';
import { InstallationData } from '../../background/installation-data';
import { UserConfigurationStore } from '../../background/stores/global/user-configuration-store';
import {
    getApplicationTelemetryDataFactory,
    getTelemetryClient,
} from '../../background/telemetry/telemetry-client-provider';
import { TelemetryEventHandler } from '../../background/telemetry/telemetry-event-handler';
import { TelemetryLogger } from '../../background/telemetry/telemetry-logger';
import { TelemetryStateListener } from '../../background/telemetry/telemetry-state-listener';
import { initializeFabricIcons } from '../../common/fabric-icons';
import { getIndexedDBStore } from '../../common/indexedDB/get-indexeddb-store';
import { IndexedDBAPI, IndexedDBUtil } from '../../common/indexedDB/indexedDB';
import { BaseClientStoresHub } from '../../common/stores/base-client-stores-hub';
import { androidAppTitle } from '../../content/strings/application';
import { ElectronAppDataAdapter } from '../adapters/electron-app-data-adapter';
import { ElectronStorageAdapter } from '../adapters/electron-storage-adapter';
import { DeviceConnectActionCreator } from '../flux/action-creator/device-connect-action-creator';
import { DeviceActions } from '../flux/action/device-actions';
import { DeviceStore } from '../flux/store/device-store';
import { ElectronLink } from './device-connect-view/components/electron-link';
import { sendAppInitializedTelemetryEvent } from './device-connect-view/send-app-initialized-telemetry';
import {
    RootContainerRenderer,
    RootContainerRendererDeps,
} from './root-container/root-container-renderer';
import { screenshotViewModelProvider } from './screenshot/screenshot-view-model-provider';

declare var window: Window & {
    insightsUserConfiguration: UserConfigurationController;
    featureFlagsController: FeatureFlagsController;
};

initializeFabricIcons();

const indexedDBInstance: IndexedDBAPI = new IndexedDBUtil(getIndexedDBStore());

const userConfigActions = new UserConfigurationActions();
const deviceActions = new DeviceActions();
const windowFrameActions = new WindowFrameActions();
const windowStateActions = new WindowStateActions();
const scanActions = new ScanActions();
const unifiedScanResultActions = new UnifiedScanResultActions();
const cardSelectionActions = new CardSelectionActions();
const detailsViewActions = new DetailsViewActions();
const sidePanelActions = new SidePanelActions();
const previewFeaturesActions = new PreviewFeaturesActions(); // not really used but needed by DetailsViewStore
const contentActions = new ContentActions(); // not really used but needed by DetailsViewStore
const featureFlagActions = new FeatureFlagActions();

const storageAdapter = new ElectronStorageAdapter(indexedDBInstance);
const appDataAdapter = new ElectronAppDataAdapter();

const indexedDBDataKeysToFetch = [
    IndexedDBDataKeys.userConfiguration,
    IndexedDBDataKeys.installation,
    IndexedDBDataKeys.unifiedFeatureFlags,
];

// tslint:disable-next-line:no-floating-promises - top-level entry points are intentionally floating promises
getPersistedData(indexedDBInstance, indexedDBDataKeysToFetch).then(
    (persistedData: Partial<PersistedData>) => {
        const installationData: InstallationData = persistedData.installationData;

        const logger = createDefaultLogger();

        const applicationTelemetryDataFactory = getApplicationTelemetryDataFactory(
            installationData,
            storageAdapter,
            appDataAdapter,
            androidAppTitle,
        );

        const platformInfo = new PlatformInfo(process);

        const userConfigurationStore = new UserConfigurationStore(
            persistedData.userConfigurationData,
            userConfigActions,
            indexedDBInstance,
        );
        userConfigurationStore.initialize();

        const deviceStore = new DeviceStore(deviceActions);
        deviceStore.initialize();

        const windowStateStore = new WindowStateStore(windowStateActions);
        windowStateStore.initialize();

        const unifiedScanResultStore = new UnifiedScanResultStore(unifiedScanResultActions);
        unifiedScanResultStore.initialize();

        const scanStore = new ScanStore(scanActions);
        scanStore.initialize();

        const cardSelectionStore = new CardSelectionStore(
            cardSelectionActions,
            unifiedScanResultActions,
        );
        cardSelectionStore.initialize();

        const detailsViewStore = new DetailsViewStore(
            previewFeaturesActions,
            contentActions,
            detailsViewActions,
            sidePanelActions,
        );
        detailsViewStore.initialize();

        const featureFlagStore = new FeatureFlagStore(
            featureFlagActions,
            storageAdapter,
            persistedData,
            new FeatureFlagDefaultsHelper(getAllFeatureFlagDetailsUnified),
        );
        featureFlagStore.initialize();

        const currentWindow = remote.getCurrentWindow();
        const windowFrameUpdater = new WindowFrameUpdater(windowFrameActions, currentWindow);
        windowFrameUpdater.initialize();

        const storesHub = new BaseClientStoresHub<RootContainerState>([
            userConfigurationStore,
            deviceStore,
            windowStateStore,
            scanStore,
            unifiedScanResultStore,
            cardSelectionStore,
            detailsViewStore,
            featureFlagStore,
        ]);

        const fetchScanResults = createScanResultsFetcher(axios.get);
        const fetchDeviceConfig = createDeviceConfigFetcher(axios.get);

        const interpreter = new Interpreter();

        const featureFlagsController = new FeatureFlagsController(featureFlagStore, interpreter);

        const dispatcher = new DirectActionMessageDispatcher(interpreter);
        const userConfigMessageCreator = new UserConfigMessageCreator(dispatcher);
        const userConfigurationActionCreator = new UserConfigurationActionCreator(
            userConfigActions,
        );

        const telemetryDataFactory = new TelemetryDataFactory();
        const telemetryLogger = new TelemetryLogger(logger);
        telemetryLogger.initialize(featureFlagsController);

        const consoleTelemetryClient = new ConsoleTelemetryClient(
            applicationTelemetryDataFactory,
            telemetryLogger,
        );

        const telemetryClient = getTelemetryClient(applicationTelemetryDataFactory, AppInsights, [
            consoleTelemetryClient,
        ]);
        const telemetryEventHandler = new TelemetryEventHandler(telemetryClient);

        registerUserConfigurationMessageCallback(interpreter, userConfigurationActionCreator);

        const telemetryStateListener = new TelemetryStateListener(
            userConfigurationStore,
            telemetryEventHandler,
        );
        telemetryStateListener.initialize();

        const ipcMessageReceiver = new IpcMessageReceiver(interpreter, ipcRenderer, logger);
        ipcMessageReceiver.initialize();

        const deviceConnectActionCreator = new DeviceConnectActionCreator(
            deviceActions,
            fetchDeviceConfig,
            telemetryEventHandler,
        );
        const windowFrameActionCreator = new WindowFrameActionCreator(windowFrameActions);
        const windowStateActionCreator = new WindowStateActionCreator(
            windowStateActions,
            windowFrameActionCreator,
        );
        const scanActionCreator = new ScanActionCreator(scanActions, deviceActions);

        const featureFlagActionCreator = new FeatureFlagsActionCreator(
            interpreter,
            featureFlagActions,
            telemetryEventHandler,
        );
        featureFlagActionCreator.registerCallbacks();

        const cardSelectionActionCreator = new CardSelectionActionCreator(
            interpreter,
            cardSelectionActions,
            telemetryEventHandler,
        );
        cardSelectionActionCreator.registerCallbacks();

        const nullDetailsViewController = new NullDetailsViewController();

        const detailsViewActionCreator = new DetailsViewActionCreator(
            interpreter,
            detailsViewActions,
            sidePanelActions,
            nullDetailsViewController,
            telemetryEventHandler,
            logger,
        );
        detailsViewActionCreator.registerCallback();

        const cardSelectionMessageCreator = new CardSelectionMessageCreator(
            dispatcher,
            telemetryDataFactory,
            TelemetryEventSource.ElectronAutomatedChecksView,
        );

        const windowFrameListener = new WindowFrameListener(
            windowStateActionCreator,
            currentWindow,
        );
        windowFrameListener.initialize();

        const getToolData = createGetToolDataDelegate(appDataAdapter);
        const unifiedResultsBuilder = createDefaultBuilder(getToolData);
        const scanController = new ScanController(
            scanActions,
            unifiedScanResultActions,
            fetchScanResults,
            unifiedResultsBuilder,
            telemetryEventHandler,
            DateProvider.getCurrentDate,
            logger,
        );

        scanController.initialize();

        const dropdownActionMessageCreator = new DropdownActionMessageCreator(
            telemetryDataFactory,
            dispatcher,
        );

        const dropdownClickHandler = new DropdownClickHandler(
            dropdownActionMessageCreator,
            TelemetryEventSource.ElectronAutomatedChecksView,
        );

        const detailsViewActionMessageCreator = new DetailsViewActionMessageCreator(
            telemetryDataFactory,
            dispatcher,
        );

        const fixInstructionProcessor = new FixInstructionProcessor();

        const cardsViewDeps: CardsViewDeps = {
            LinkComponent: ElectronLink,

            cardInteractionSupport: onlyHighlightingSupported, // once we have a working settings experience, switch to allCardInteractionsSupported
            getCardSelectionViewData: getCardSelectionViewData,
            collapsibleControl: CardsCollapsibleControl,
            cardsVisualizationModifierButtons: ExpandCollapseVisualHelperModifierButtons,
            fixInstructionProcessor,
            getGuidanceTagsFromGuidanceLinks: GetGuidanceTagsFromGuidanceLinks,

            userConfigMessageCreator: userConfigMessageCreator,
            cardSelectionMessageCreator,

            detailsViewActionMessageCreator,
            issueFilingActionMessageCreator: null, // we don't support issue filing right now

            environmentInfoProvider: null,
            getPropertyConfigById: getPropertyConfiguration, // this seems to be axe-core specific

            issueDetailsTextGenerator: null,
            issueFilingServiceProvider: null, // we don't support issue filing right now
            navigatorUtils: null,
            unifiedResultToIssueFilingDataConverter: null, // we don't support issue filing right now
            windowUtils: null,
            setFocusVisibility,
            customCongratsMessage:
                "No failed automated checks were found. Continue investigating your app's accessibility compliance through manual testing.",
        };

        const documentManipulator = new DocumentManipulator(document);

        const reportHtmlGenerator = new ReportHtmlGenerator(
            UnifiedReportSectionFactory,
            new ReactStaticRenderer(),
            {
                applicationProperties: { name: 'Android app', version: '0.0.1' },
                scanEngineProperties: { name: 'axe-android', version: '0.0.1' },
            }, // stubbed values for the moment
            getDefaultAddListenerForCollapsibleSection,
            DateProvider.getUTCStringFromDate,
            GetGuidanceTagsFromGuidanceLinks,
            fixInstructionProcessor,
            getPropertyConfiguration,
        );

        const reportGenerator = new ReportGenerator(
            new ReportNameGenerator(),
            reportHtmlGenerator,
            null,
        );

        const deps: RootContainerRendererDeps = {
            currentWindow,
            userConfigurationStore,
            deviceStore,
            userConfigMessageCreator,
            windowStateActionCreator,
            dropdownClickHandler,
            LinkComponent: ElectronLink,
            fetchScanResults,
            deviceConnectActionCreator,
            storesHub,
            scanActionCreator,
            windowFrameActionCreator,
            platformInfo,
            getCardsViewData: getCardViewData,
            getCardSelectionViewData: getCardSelectionViewData,
            screenshotViewModelProvider,
            ...cardsViewDeps,
            storeActionMessageCreator: new NullStoreActionMessageCreator(),
            settingsProvider: UnifiedSettingsProvider,
            loadTheme,
            documentManipulator,
            reportGenerator: reportGenerator,
            fileURLProvider: new FileURLProvider(new WindowUtils(), provideBlob),
            getCurrentDate: DateProvider.getCurrentDate,
        };

        window.insightsUserConfiguration = new UserConfigurationController(interpreter);
        window.featureFlagsController = featureFlagsController;

        const renderer = new RootContainerRenderer(ReactDOM.render, document, deps);
        renderer.render();

        sendAppInitializedTelemetryEvent(telemetryEventHandler, platformInfo);

        ipcRenderer.send(IPC_MAIN_WINDOW_INITIALIZED_CHANNEL_NAME);
    },
);
