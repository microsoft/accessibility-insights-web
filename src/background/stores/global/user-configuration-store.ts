// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { autobind } from '@uifabric/utilities';
import { cloneDeep } from 'lodash';

import { IndexedDBAPI } from '../../../common/indexedDB/indexedDB';
import { StoreNames } from '../../../common/stores/store-names';
import { UserConfigurationStoreData } from '../../../common/types/store-data/user-configuration-store';
import { SetTelemetryStatePayload } from '../../actions/action-payloads';
import { UserConfigurationActions } from '../../actions/user-configuration-actions';
import { IndexedDBDataKeys } from '../../IndexedDBDataKeys';
import { BaseStore } from '../base-store';

export class UserConfigurationStore extends BaseStore<UserConfigurationStoreData> {
    public static readonly defaultState: UserConfigurationStoreData = {
        enableTelemetry: false,
        isFirstTime: true,
    };

    constructor(
        private readonly initialState: UserConfigurationStoreData,
        private readonly userConfigActions: UserConfigurationActions,
        private readonly indexDbApi: IndexedDBAPI,
    ) {
        super(StoreNames.UserConfigurationStore);
    }

    public getDefaultState(): UserConfigurationStoreData {
        return this.initialState ? cloneDeep(this.initialState) : cloneDeep(UserConfigurationStore.defaultState);
    }

    protected addActionListeners(): void {
        this.userConfigActions.getCurrentState.addListener(this.onGetCurrentState);
        this.userConfigActions.setTelemetryState.addListener(this.onSetTelemetryState);
    }

    @autobind
    private onSetTelemetryState(payload: SetTelemetryStatePayload) {
        this.state.isFirstTime = false;
        this.state.enableTelemetry = payload.enableTelemetry;

        // tslint:disable-next-line:no-floating-promises - grandfathered-in pre-existing violation
        this.indexDbApi.setItem(IndexedDBDataKeys.userConfiguration, this.state);
        this.emitChanged();
    }
}
