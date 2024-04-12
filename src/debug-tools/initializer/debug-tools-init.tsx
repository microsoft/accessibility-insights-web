// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BrowserAdapterFactory } from 'common/browser-adapters/browser-adapter-factory';
import { BrowserMessageDistributor } from 'common/browser-adapters/browser-message-distributor';
import { DateProvider } from 'common/date-provider';
import { TelemetryEventSource } from 'common/extension-telemetry-events';
import { initializeFabricIcons } from 'common/fabric-icons';
import { createDefaultLogger } from 'common/logging/default-logger';
import { RemoteActionMessageDispatcher } from 'common/message-creators/remote-action-message-dispatcher';
import { getNarrowModeThresholdsForWeb } from 'common/narrow-mode-thresholds';
import { StoreProxy } from 'common/store-proxy';
import { StoreUpdateMessageHub } from 'common/store-update-message-hub';
import { ClientStoresHub } from 'common/stores/client-stores-hub';
import { StoreNames } from 'common/stores/store-names';
import { ExceptionTelemetryListener } from 'common/telemetry/exception-telemetry-listener';
import { ExceptionTelemetrySanitizer } from 'common/telemetry/exception-telemetry-sanitizer';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { PermissionsStateStoreData } from 'common/types/store-data/permissions-state-store-data';
import { ScopingStoreData } from 'common/types/store-data/scoping-store-data';
import { UserConfigurationStoreData } from 'common/types/store-data/user-configuration-store';
import { textContent } from 'content/strings/text-content';
import { DebugToolsNavActionCreator } from 'debug-tools/action-creators/debug-tools-nav-action-creator';
import { DebugToolsNavActions } from 'debug-tools/actions/debug-tools-nav-actions';
import {
    DebugToolsView,
    DebugToolsViewDeps,
    DebugToolsViewState,
} from 'debug-tools/components/debug-tools-view';
import { defaultDateFormatter } from 'debug-tools/components/telemetry-viewer/telemetry-messages-list';
import { TelemetryListener } from 'debug-tools/controllers/telemetry-listener';
import { DebugToolsNavStore } from 'debug-tools/stores/debug-tools-nav-store';
import * as React from 'react';
import { createRoot } from 'react-dom/client';
import UAParser from 'ua-parser-js';

export const initializeDebugTools = () => {
    initializeFabricIcons();
    const logger = createDefaultLogger();
    const userAgentParser = new UAParser(window.navigator.userAgent);
    const browserAdapterFactory = new BrowserAdapterFactory(userAgentParser);
    const browserAdapter = browserAdapterFactory.makeFromUserAgent();

    const actionMessageDispatcher = new RemoteActionMessageDispatcher(
        browserAdapter.sendMessageToFrames,
        null,
        logger,
    );
    const telemetrySanitizer = new ExceptionTelemetrySanitizer(browserAdapter.getExtensionId());
    const exceptionTelemetryListener = new ExceptionTelemetryListener(
        TelemetryEventSource.DebugTools,
        actionMessageDispatcher.sendTelemetry,
        telemetrySanitizer,
    );
    exceptionTelemetryListener.initialize(logger);

    const storeUpdateMessageHub = new StoreUpdateMessageHub(actionMessageDispatcher);

    const telemetryListener = new TelemetryListener(DateProvider.getCurrentDate);
    const messageDistributor = new BrowserMessageDistributor(browserAdapter, [
        telemetryListener.handleBrowserMessage,
        storeUpdateMessageHub.handleBrowserMessage,
    ]);
    messageDistributor.initialize();

    const storeProxies = createStoreProxies(storeUpdateMessageHub);

    const debugToolsNavActions = new DebugToolsNavActions();

    const debugToolsNavStore = new DebugToolsNavStore(debugToolsNavActions);
    debugToolsNavStore.initialize();
    const debugToolsNavActionCreator = new DebugToolsNavActionCreator(debugToolsNavActions);

    const allStores = [...storeProxies, debugToolsNavStore];
    const storesHub = new ClientStoresHub<DebugToolsViewState>(allStores);

    const props: DebugToolsViewDeps = {
        debugToolsNavActionCreator,
        storesHub,
        telemetryListener,
        textContent,
        dateFormatter: defaultDateFormatter,
        getNarrowModeThresholds: getNarrowModeThresholdsForWeb,
    };

    render(props);
};

const createStoreProxies = (storeUpdateMessageHub: StoreUpdateMessageHub) => {
    const featureFlagStore = new StoreProxy<FeatureFlagStoreData>(
        StoreNames[StoreNames.FeatureFlagStore],
        storeUpdateMessageHub,
    );
    const scopingStore = new StoreProxy<ScopingStoreData>(
        StoreNames[StoreNames.ScopingPanelStateStore],
        storeUpdateMessageHub,
    );
    const userConfigurationStore = new StoreProxy<UserConfigurationStoreData>(
        StoreNames[StoreNames.UserConfigurationStore],
        storeUpdateMessageHub,
    );
    const permissionsStore = new StoreProxy<PermissionsStateStoreData>(
        StoreNames[StoreNames.PermissionsStateStore],
        storeUpdateMessageHub,
    );

    return [featureFlagStore, scopingStore, userConfigurationStore, permissionsStore];
};

const render = (deps: DebugToolsViewDeps) => {
    const container = document.querySelector('#debug-tools-container');
    const root = createRoot(container)
    root.render(<DebugToolsView deps={deps} />);
};

initializeDebugTools();
