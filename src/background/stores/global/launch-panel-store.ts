// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IndexedDBDataKeys } from 'background/IndexedDBDataKeys';
import { StorageAdapter } from 'common/browser-adapters/storage-adapter';
import { PersistentStore } from 'common/flux/persistent-store';
import { IndexedDBAPI } from 'common/indexedDB/indexedDB';
import { Logger } from 'common/logging/logger';
import { StoreNames } from 'common/stores/store-names';
import {
    LaunchPanelStoreData,
    LaunchPanelType,
} from 'common/types/store-data/launch-panel-store-data';
import { LocalStorageDataKeys } from '../../local-storage-data-keys';
import { LocalStorageData } from '../../storage-data';
import { LaunchPanelStateActions } from './../../actions/launch-panel-state-action';

export class LaunchPanelStore extends PersistentStore<LaunchPanelStoreData> {
    constructor(
        private readonly launchPanelStateActions: LaunchPanelStateActions,
        private readonly storageAdapter: StorageAdapter,
        private readonly userData: LocalStorageData,
        persistedState: LaunchPanelStoreData,
        idbInstance: IndexedDBAPI,
        logger: Logger,
    ) {
        super(
            StoreNames.LaunchPanelStateStore,
            persistedState,
            idbInstance,
            IndexedDBDataKeys.launchPanelStore,
            logger,
        );
    }

    public getDefaultState(): LaunchPanelStoreData {
        const defaultValues: LaunchPanelStoreData = {
            launchPanelType: LaunchPanelType.LaunchPad,
        };

        const stateFromLocalStorage = this.userData ? this.userData.launchPanelSetting : null;
        if (stateFromLocalStorage != null) {
            defaultValues.launchPanelType = stateFromLocalStorage;
        }

        return defaultValues;
    }

    protected addActionListeners(): void {
        this.launchPanelStateActions.setLaunchPanelType.addListener(this.onSetLaunchPanelType);
        this.launchPanelStateActions.getCurrentState.addListener(this.onGetCurrentState);
    }

    private onSetLaunchPanelType = (panelType: LaunchPanelType): void => {
        this.state.launchPanelType = panelType;
        this.storageAdapter
            .setUserData({ [LocalStorageDataKeys.launchPanelSetting]: panelType })
            .catch(console.error);
        this.emitChanged();
    };
}
