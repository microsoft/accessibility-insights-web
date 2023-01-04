// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { DataTransferActions } from 'background/actions/data-transfer-actions';
import { BaseStoreImpl } from 'background/stores/base-store-impl';
import { StoreNames } from 'common/stores/store-names';
import { DataTransferStoreData } from 'common/types/store-data/data-transfer-store-data';

export class DataTransferStore extends BaseStoreImpl<DataTransferStoreData, Promise<void>> {
    constructor(private readonly dataTransferActions: DataTransferActions) {
        super(StoreNames.DataTransferStore);
    }

    public getDefaultState(): DataTransferStoreData {
        return {
            quickAssessToAssessmentInitiated: false,
        };
    }

    protected addActionListeners(): void {
        this.dataTransferActions.getCurrentState.addListener(this.onGetCurrentState);
        this.dataTransferActions.initiateTransferQuickAssessDataToAssessment.addListener(
            this.onInitiateQuickAssessToAssessmentTransfer,
        );
        this.dataTransferActions.finalizeTransferQuickAssessDataToAssessment.addListener(
            this.onFinalizeQuickAssessToAssessmentTransfer,
        );
    }

    private onInitiateQuickAssessToAssessmentTransfer = async (): Promise<void> => {
        this.state.quickAssessToAssessmentInitiated = true;
        await this.emitChanged();
    };

    private onFinalizeQuickAssessToAssessmentTransfer = async (): Promise<void> => {
        this.state.quickAssessToAssessmentInitiated = false;
        await this.emitChanged();
    };
}
