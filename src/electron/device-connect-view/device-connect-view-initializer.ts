// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { remote } from 'electron';
import * as ReactDOM from 'react-dom';

import { UserConfigurationActions } from '../../background/actions/user-configuration-actions';
import { getPersistedData, PersistedData } from '../../background/get-persisted-data';
import { IndexedDBDataKeys } from '../../background/IndexedDBDataKeys';
import { UserConfigurationStore } from '../../background/stores/global/user-configuration-store';
import { initializeFabricIcons } from '../../common/fabric-icons';
import { getIndexedDBStore } from '../../common/indexedDB/get-indexeddb-store';
import { IndexedDBAPI, IndexedDBUtil } from '../../common/indexedDB/indexedDB';
import { DeviceConnectViewRenderer } from './device-connect-view-renderer';

initializeFabricIcons();

const indexedDBInstance: IndexedDBAPI = new IndexedDBUtil(getIndexedDBStore());
const userConfigActions = new UserConfigurationActions();

const indexedDBDataKeysToFetch = [IndexedDBDataKeys.userConfiguration];

// tslint:disable-next-line:no-floating-promises - top-level entry points are intentionally floating promises
getPersistedData(indexedDBInstance, indexedDBDataKeysToFetch).then((persistedData: Partial<PersistedData>) => {
    // tslint:disable-next-line:no-unused-variable
    const userConfigurationStore = new UserConfigurationStore(persistedData.userConfigurationData, userConfigActions, indexedDBInstance);

    const dom = document;
    const renderer = new DeviceConnectViewRenderer(ReactDOM.render, dom, remote.getCurrentWindow());
    renderer.render();
});
