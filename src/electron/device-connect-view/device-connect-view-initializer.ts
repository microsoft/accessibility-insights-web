// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AppInsights } from 'applicationinsights-js';
import { remote } from 'electron';
import * as ReactDOM from 'react-dom';

import { UserConfigurationActions } from '../../background/actions/user-configuration-actions';
import { getPersistedData, PersistedData } from '../../background/get-persisted-data';
import { IndexedDBDataKeys } from '../../background/IndexedDBDataKeys';
import { InstallationData } from '../../background/installation-data';
import { UserConfigurationStore } from '../../background/stores/global/user-configuration-store';
import { TelemetryEventHandler } from '../../background/telemetry/telemetry-event-handler';
import { TelemetryLogger } from '../../background/telemetry/telemetry-logger';
import { TelemetryStateListener } from '../../background/telemetry/telemetry-state-listener';
import { initializeFabricIcons } from '../../common/fabric-icons';
import { getIndexedDBStore } from '../../common/indexedDB/get-indexeddb-store';
import { IndexedDBAPI, IndexedDBUtil } from '../../common/indexedDB/indexedDB';
import { ElectronAppDataAdapter } from '../adapters/electron-app-data-adapter';
import { ElectronStorageAdapter } from '../adapters/electron-storage-adapter';
import { getTelemetryClientWrapper } from '../telemetry/telemetry-client-provider-wrapper';
import { DeviceConnectViewRenderer } from './device-connect-view-renderer';

initializeFabricIcons();

const indexedDBInstance: IndexedDBAPI = new IndexedDBUtil(getIndexedDBStore());
const userConfigActions = new UserConfigurationActions();
const storageAdapter = new ElectronStorageAdapter(indexedDBInstance);
const appDataAdapter = new ElectronAppDataAdapter();

const indexedDBDataKeysToFetch = [IndexedDBDataKeys.userConfiguration, IndexedDBDataKeys.installation];

// tslint:disable-next-line:no-floating-promises - top-level entry points are intentionally floating promises
getPersistedData(indexedDBInstance, indexedDBDataKeysToFetch).then((persistedData: Partial<PersistedData>) => {
    const installationData: InstallationData = persistedData.installationData;

    // wireup telemetry
    const telemetryLogger = new TelemetryLogger();
    const telemetryClient = getTelemetryClientWrapper(installationData, appDataAdapter, telemetryLogger, AppInsights, storageAdapter);
    const telemetryEventHandler = new TelemetryEventHandler(telemetryClient);

    const userConfigurationStore = new UserConfigurationStore(persistedData.userConfigurationData, userConfigActions, indexedDBInstance);
    userConfigurationStore.initialize();

    const telemetryStateListener = new TelemetryStateListener(userConfigurationStore, telemetryEventHandler);
    telemetryStateListener.initialize();

    const dom = document;
    const props = {
        deps: {
            currentWindow: remote.getCurrentWindow(),
        },
    };

    const renderer = new DeviceConnectViewRenderer(ReactDOM.render, dom, props);
    renderer.render();
});
