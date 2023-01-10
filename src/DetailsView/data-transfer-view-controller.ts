// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { DataTransferViewActions } from 'DetailsView/components/tab-stops/data-transfer-view-actions';

export class DataTransferViewController {
    constructor(private actions: DataTransferViewActions) {}

    public showQuickAssessToAssessmentConfirmDialog = async () =>
        await this.actions.showQuickAssessToAssessmentConfirmDialog.invoke();

    public hideQuickAssessToAssessmentConfirmDialog = async () =>
        await this.actions.hideQuickAssessToAssessmentConfirmDialog.invoke();
}
