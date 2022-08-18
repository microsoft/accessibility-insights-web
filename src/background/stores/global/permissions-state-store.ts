// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { SetAllUrlsPermissionStatePayload } from 'background/actions/action-payloads';
import { PermissionsStateActions } from 'background/actions/permissions-state-actions';
import { IndexedDBDataKeys } from 'background/IndexedDBDataKeys';
import { PersistentStore } from 'common/flux/persistent-store';
import { IndexedDBAPI } from 'common/indexedDB/indexedDB';
import { Logger } from 'common/logging/logger';
import { StoreNames } from 'common/stores/store-names';
import { PermissionsStateStoreData } from 'common/types/store-data/permissions-state-store-data';

export class PermissionsStateStore extends PersistentStore<PermissionsStateStoreData> {
    constructor(
        private readonly permissionsStateActions: PermissionsStateActions,
        protected readonly persistedState: PermissionsStateStoreData,
        idbInstance: IndexedDBAPI,
        logger: Logger,
        persistStoreData: boolean,
    ) {
        super(
            StoreNames.PermissionsStateStore,
            persistedState,
            idbInstance,
            IndexedDBDataKeys.permissionsStateStore,
            logger,
            persistStoreData,
        );
    }

    public getDefaultState(): PermissionsStateStoreData {
        const defaultState = {
            hasAllUrlAndFilePermissions: false,
        };

        return defaultState;
    }

    protected addActionListeners(): void {
        this.permissionsStateActions.getCurrentState.addListener(this.onGetCurrentState);
        this.permissionsStateActions.setPermissionsState.addListener(this.onSetPermissionsState);
    }

    private onSetPermissionsState = async (
        payload: SetAllUrlsPermissionStatePayload,
    ): Promise<void> => {
        if (this.state.hasAllUrlAndFilePermissions !== payload.hasAllUrlAndFilePermissions) {
            this.state.hasAllUrlAndFilePermissions = payload.hasAllUrlAndFilePermissions;
            await this.emitChanged();
        }
    };
}
