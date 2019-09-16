// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { remote } from 'electron';
import { Store } from 'idb-keyval';
import * as ReactDOM from 'react-dom';

import { UserConfigurationActions } from '../../background/actions/user-configuration-actions';
import { getPersistedUserConfigData, PersistedData } from '../../background/get-persisted-data';
import { UserConfigurationStore } from '../../background/stores/global/user-configuration-store';
import { COMMON_CONSTANTS } from '../../common/constants';
import { initializeFabricIcons } from '../../common/fabric-icons';
import { IndexedDBAPI, IndexedDBUtil } from '../../common/indexedDB/indexedDB';
import { StoreNames } from '../../common/stores/store-names';
import { UserConfigurationStoreData } from '../../common/types/store-data/user-configuration-store';
import { DeviceConnectViewRenderer } from './device-connect-view-renderer';

function createUserConfigStore(
    persistedState: UserConfigurationStoreData,
    userConfigActionsLocal: UserConfigurationActions,
    indexedDBAPI: IndexedDBAPI,
): UserConfigurationStore {
    const userConfigurationStore = new UserConfigurationStore(persistedState, userConfigActionsLocal, indexedDBAPI);
    return userConfigurationStore;
}

initializeFabricIcons();

const store = new Store(COMMON_CONSTANTS.defaultIndexedDBName, COMMON_CONSTANTS.defaultIndexedDBStoreName);
const indexedDBInstance: IndexedDBAPI = new IndexedDBUtil(store);
const userConfigActions = new UserConfigurationActions();

// tslint:disable-next-line:no-floating-promises - top-level entry points are intentionally floating promises
getPersistedUserConfigData(indexedDBInstance).then((persistedData: Partial<PersistedData>) => {
    createUserConfigStore(persistedData.userConfigurationData, userConfigActions, indexedDBInstance);
    const dom = document;
    const renderer = new DeviceConnectViewRenderer(ReactDOM.render, dom, remote.getCurrentWindow());
    renderer.render();
});
