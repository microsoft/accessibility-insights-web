// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { remote } from 'electron';
import { Store as IndexedDBStore } from 'idb-keyval';
import * as ReactDOM from 'react-dom';

import { UserConfigurationActions } from '../../background/actions/user-configuration-actions';
import { getPersistedUserConfigData, PersistedData } from '../../background/get-persisted-data';
import { UserConfigurationStore } from '../../background/stores/global/user-configuration-store';
import { COMMON_CONSTANTS } from '../../common/constants';
import { initializeFabricIcons } from '../../common/fabric-icons';
import { IndexedDBAPI, IndexedDBUtil } from '../../common/indexedDB/indexedDB';
import { DeviceConnectViewRenderer } from './device-connect-view-renderer';

initializeFabricIcons();

const indexedDBStore = new IndexedDBStore(COMMON_CONSTANTS.defaultIndexedDBName, COMMON_CONSTANTS.defaultIndexedDBStoreName);
const indexedDBInstance: IndexedDBAPI = new IndexedDBUtil(indexedDBStore);
const userConfigActions = new UserConfigurationActions();

// tslint:disable-next-line:no-floating-promises - top-level entry points are intentionally floating promises
getPersistedUserConfigData(indexedDBInstance).then((persistedData: Partial<PersistedData>) => {
    // tslint:disable-next-line:no-unused-variable
    const userConfigurationStore = new UserConfigurationStore(persistedData.userConfigurationData, userConfigActions, indexedDBInstance);

    const dom = document;
    const renderer = new DeviceConnectViewRenderer(ReactDOM.render, dom, remote.getCurrentWindow());
    renderer.render();
});
