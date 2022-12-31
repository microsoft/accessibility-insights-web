// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { TransferAssessmentPayload } from 'background/actions/action-payloads';
import { Interpreter } from 'background/interpreter';
import { AssessmentStore } from 'background/stores/assessment-store';
import { DataTransferStore } from 'background/stores/global/data-transfer-store';
import { Messages } from 'common/messages';

export class QuickAssessToAssessmentConverter {
    constructor(
        private dataTransferStore: DataTransferStore,
        private quickAssessStore: AssessmentStore,
        private interpreter: Interpreter,
    ) {}

    public initialize(): void {
        this.dataTransferStore.addChangedListener(this.onDataTransferStoreChange);
    }

    private onDataTransferStoreChange = async (): Promise<void> => {
        const dataTransferState = this.dataTransferStore.getState();
        if (dataTransferState.quickAssessToAssessmentInitiated === false) {
            return;
        }

        const quickAssessData = this.quickAssessStore.getState();

        await this.interpreter.interpret({
            messageType: Messages.DataTransfer.TransferDataToAssessment,
            payload: { assessmentData: quickAssessData } as TransferAssessmentPayload,
        }).result;

        await this.interpreter.interpret({
            messageType: Messages.DataTransfer.FinalizeTransferDataToAssessment,
        }).result;
    };
}
