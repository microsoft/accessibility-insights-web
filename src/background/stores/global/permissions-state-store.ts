// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { SetAllUrlsPermissionStatePayload } from 'background/actions/action-payloads';
import { PermissionsStateActions } from 'background/actions/permissions-state-actions';
import { BaseStoreImpl } from 'background/stores/base-store-impl';
import { StoreNames } from 'common/stores/store-names';
import { PermissionsStateStoreData } from 'common/types/store-data/permissions-state-store-data';

export class PermissionsStateStore extends BaseStoreImpl<PermissionsStateStoreData> {
    constructor(private readonly permissionsStateActions: PermissionsStateActions) {
        super(StoreNames.PermissionsStateStore);
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

    private onSetPermissionsState = (payload: SetAllUrlsPermissionStatePayload): void => {
        if (this.state.hasAllUrlAndFilePermissions !== payload.hasAllUrlAndFilePermissions) {
            this.state.hasAllUrlAndFilePermissions = payload.hasAllUrlAndFilePermissions;
            this.emitChanged();
        }
    };
}
