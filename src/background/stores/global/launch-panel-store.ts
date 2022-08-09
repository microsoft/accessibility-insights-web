// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BaseStoreImpl } from 'background/stores/base-store-impl';
import { StorageAdapter } from 'common/browser-adapters/storage-adapter';
import { StoreNames } from 'common/stores/store-names';
import {
    LaunchPanelStoreData,
    LaunchPanelType,
} from 'common/types/store-data/launch-panel-store-data';
import { LocalStorageDataKeys } from '../../local-storage-data-keys';
import { LocalStorageData } from '../../storage-data';
import { LaunchPanelStateActions } from './../../actions/launch-panel-state-action';

export class LaunchPanelStore extends BaseStoreImpl<LaunchPanelStoreData, Promise<void>> {
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

    private onSetLaunchPanelType = async (panelType: LaunchPanelType): Promise<void> => {
        this.state.launchPanelType = panelType;
        this.storageAdapter
            .setUserData({ [LocalStorageDataKeys.launchPanelSetting]: panelType })
            .catch(console.error);
        await this.emitChanged();
    };
}
