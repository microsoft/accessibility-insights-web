// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BaseStoreImpl } from 'background/stores/base-store-impl';
import { StoreNames } from 'common/stores/store-names';
import { AndroidSetupActions } from '../action/android-setup-actions';
import { AndroidSetupStoreData } from '../types/android-setup-store-data';

export class AndroidSetupStore extends BaseStoreImpl<AndroidSetupStoreData> {
    constructor(private readonly androidSetupActions: AndroidSetupActions) {
        super(StoreNames.AndroidSetupStore);
    }

    public getDefaultState(): AndroidSetupStoreData {
        return { currentStepId: 'detect-adb' };
    }

    private onCancel = () => {
        this.emitChanged();
    };

    protected addActionListeners(): void {
        this.androidSetupActions.cancel.addListener(this.onCancel);
    }
}
