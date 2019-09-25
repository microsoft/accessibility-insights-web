// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { StorageAdapter } from 'common/browser-adapters/storage-adapter';
import { StoreNames } from 'common/stores/store-names';
import { LaunchPanelStoreData } from 'common/types/store-data/launch-panel-store-data';
import { LaunchPanelType } from 'popup/components/popup-view';
import { LocalStorageDataKeys } from '../../local-storage-data-keys';
import { LocalStorageData } from '../../storage-data';
import { BaseStoreImpl } from '../base-store-impl';
import { LaunchPanelStateActions } from './../../actions/launch-panel-state-action';

export class LaunchPanelStore extends BaseStoreImpl<LaunchPanelStoreData> {
    constructor(
        private readonly launchPanelStateActions: LaunchPanelStateActions,
        private readonly storageAdapter: StorageAdapter,
        private readonly userData: LocalStorageData,
    ) {
        super(StoreNames.LaunchPanelStateStore);
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
        this.storageAdapter.setUserDataP({ [LocalStorageDataKeys.launchPanelSetting]: panelType }).catch(console.log);
        this.emitChanged();
    };
}
