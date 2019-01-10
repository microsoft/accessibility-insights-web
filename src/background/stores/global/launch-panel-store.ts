// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { autobind } from '@uifabric/utilities';

import { StoreNames } from '../../../common/stores/store-names';
import { ILaunchPanelStoreData } from '../../../common/types/store-data/ilaunch-panel-store-data';
import { LaunchPanelType } from '../../../popup/scripts/components/popup-view';
import { BrowserAdapter } from '../../browser-adapter';
import { LocalStorageDataKeys } from '../../local-storage-data-keys';
import { ILocalStorageData } from '../../storage-data';
import { BaseStore } from '../base-store';
import { LaunchPanelStateActions } from './../../actions/launch-panel-state-action';

export class LaunchPanelStore extends BaseStore<ILaunchPanelStoreData> {
    private launchPanelStateActions: LaunchPanelStateActions;
    private browserAdapter: BrowserAdapter;
    private userData: ILocalStorageData;

    constructor(launchPanelStateActions: LaunchPanelStateActions, browserAdapter: BrowserAdapter, userData: ILocalStorageData) {
        super(StoreNames.LaunchPanelStateStore);

        this.launchPanelStateActions = launchPanelStateActions;
        this.browserAdapter = browserAdapter;
        this.userData = userData;
    }

    public getDefaultState(): ILaunchPanelStoreData {
        const defaultValues: ILaunchPanelStoreData = {
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

    @autobind
    private onSetLaunchPanelType(type: LaunchPanelType): void {
        this.state.launchPanelType = type;
        this.browserAdapter.setUserData({ [LocalStorageDataKeys.launchPanelSetting]: type });
        this.emitChanged();
    }
}
