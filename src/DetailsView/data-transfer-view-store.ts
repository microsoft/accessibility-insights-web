// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { BaseStoreImpl } from 'background/stores/base-store-impl';
import { StoreNames } from 'common/stores/store-names';
import { DataTransferViewActions } from 'DetailsView/components/tab-stops/data-transfer-view-actions';

export interface DataTransferViewStoreData {
    showQuickAssessToAssessmentConfirmDialog: boolean;
}

export class DataTransferViewStore extends BaseStoreImpl<DataTransferViewStoreData> {
    public constructor(private actions: DataTransferViewActions) {
        super(StoreNames.DataTransferViewStore);
    }

    public getDefaultState(): DataTransferViewStoreData {
        return {
            showQuickAssessToAssessmentConfirmDialog: false,
        };
    }

    public addActionListeners(): void {
        this.actions.showQuickAssessToAssessmentConfirmDialog.addListener(
            this.onShowQuickAssessToAssessmentConfirmDialog,
        );
        this.actions.hideQuickAssessToAssessmentConfirmDialog.addListener(
            this.onHideQuickAssessToAssessmentConfirmDialog,
        );
    }

    private onShowQuickAssessToAssessmentConfirmDialog = async () => {
        this.state.showQuickAssessToAssessmentConfirmDialog = true;
        this.emitChanged();
    };

    private onHideQuickAssessToAssessmentConfirmDialog = async () => {
        this.state.showQuickAssessToAssessmentConfirmDialog = false;
        this.emitChanged();
    };
}
