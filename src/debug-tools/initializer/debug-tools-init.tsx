// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BaseStore } from 'common/base-store';
import { BrowserAdapter } from 'common/browser-adapters/browser-adapter';
import { ChromeAdapter } from 'common/browser-adapters/chrome-adapter';
import { initializeFabricIcons } from 'common/fabric-icons';
import { createDefaultLogger } from 'common/logging/default-logger';
import { RemoteActionMessageDispatcher } from 'common/message-creators/remote-action-message-dispatcher';
import { StoreActionMessageCreatorFactory } from 'common/message-creators/store-action-message-creator-factory';
import { StoreProxy } from 'common/store-proxy';
import { BaseClientStoresHub } from 'common/stores/base-client-stores-hub';
import { StoreNames } from 'common/stores/store-names';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { PermissionsStateStoreData } from 'common/types/store-data/permissions-state-store-data';
import { ScopingStoreData } from 'common/types/store-data/scoping-store-data';
import { UserConfigurationStoreData } from 'common/types/store-data/user-configuration-store';
import { textContent } from 'content/strings/text-content';
import {
    DebugToolsView,
    DebugToolsViewDeps,
    DebugToolsViewState,
} from 'debug-tools/components/debug-tools-view';
import { TelemetryListener } from 'debug-tools/controllers/telemetry-listener';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

export const initializeDebugTools = () => {
    initializeFabricIcons();
    const browserAdapter = new ChromeAdapter();

    const stores = createStoreProxies(browserAdapter);
    const storeActionMessageCreator = getStoreActionMessageCreator(browserAdapter, stores);

    const storesHub = new BaseClientStoresHub<DebugToolsViewState>(stores);

    const telemetryListener = new TelemetryListener(browserAdapter, createDefaultLogger());
    telemetryListener.initialize();

    const props: DebugToolsViewDeps = {
        storesHub,
        storeActionMessageCreator,
        textContent,
    };

    render(props);
};

const createStoreProxies = (browserAdapter: BrowserAdapter) => {
    const featureFlagStore = new StoreProxy<FeatureFlagStoreData>(
        StoreNames[StoreNames.FeatureFlagStore],
        browserAdapter,
    );
    const scopingStore = new StoreProxy<ScopingStoreData>(
        StoreNames[StoreNames.ScopingPanelStateStore],
        browserAdapter,
    );
    const userConfigurationStore = new StoreProxy<UserConfigurationStoreData>(
        StoreNames[StoreNames.UserConfigurationStore],
        browserAdapter,
    );
    const permissionsStore = new StoreProxy<PermissionsStateStoreData>(
        StoreNames[StoreNames.PermissionsStateStore],
        browserAdapter,
    );

    return [featureFlagStore, scopingStore, userConfigurationStore, permissionsStore];
};

const getStoreActionMessageCreator = (browserAdapter: BrowserAdapter, stores: BaseStore<any>[]) => {
    const actionMessageDispatcher = new RemoteActionMessageDispatcher(
        browserAdapter.sendMessageToFrames,
        null,
        createDefaultLogger(),
    );

    const storeActionMessageCreatorFactory = new StoreActionMessageCreatorFactory(
        actionMessageDispatcher,
    );

    return storeActionMessageCreatorFactory.fromStores(stores);
};

const render = (deps: DebugToolsViewDeps) => {
    const container = document.querySelector('#debug-tools-container');

    ReactDOM.render(<DebugToolsView deps={deps} />, container);
};

initializeDebugTools();
