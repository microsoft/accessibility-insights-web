// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { remote } from 'electron';
import * as ReactDOM from 'react-dom';
import { UserConfigurationActions } from '../../background/actions/user-configuration-actions';
import { getPersistedData, PersistedData } from '../../background/get-persisted-data';
import { UserConfigurationActionCreator } from '../../background/global-action-creators/user-configuration-action-creator';
import { IndexedDBDataKeys } from '../../background/IndexedDBDataKeys';
import { UserConfigurationStore } from '../../background/stores/global/user-configuration-store';
import { initializeFabricIcons } from '../../common/fabric-icons';
import { getIndexedDBStore } from '../../common/indexedDB/get-indexeddb-store';
import { IndexedDBAPI, IndexedDBUtil } from '../../common/indexedDB/indexedDB';
import { ElectronExternalLink } from './components/electron-external-link';
import { DeviceConnectViewRenderer } from './device-connect-view-renderer';

initializeFabricIcons();

const indexedDBInstance: IndexedDBAPI = new IndexedDBUtil(getIndexedDBStore());
const userConfigActions = new UserConfigurationActions();

const indexedDBDataKeysToFetch = [IndexedDBDataKeys.userConfiguration];

// tslint:disable-next-line:no-floating-promises - top-level entry points are intentionally floating promises
getPersistedData(indexedDBInstance, indexedDBDataKeysToFetch).then((persistedData: Partial<PersistedData>) => {
    const userConfigurationStore = new UserConfigurationStore(persistedData.userConfigurationData, userConfigActions, indexedDBInstance);
    userConfigurationStore.initialize();

    const userConfigMessageCreator = new UserConfigurationActionCreator(userConfigActions);

    const dom = document;
    const props = {
        deps: {
            currentWindow: remote.getCurrentWindow(),
            userConfigurationStore,
            userConfigMessageCreator,
            LinkComponent: ElectronExternalLink,
        },
    };

    const renderer = new DeviceConnectViewRenderer(ReactDOM.render, dom, props);
    renderer.render();
});
