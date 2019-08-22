// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { RegisterTypeToPayloadCallback } from '../../common/message';
import { Messages } from '../../common/messages';
import { UnifiedScanCompletedPayload } from './action-payloads';
import { UnifiedScanResultActions } from './unified-scan-result-actions';

export class UnifiedScanResultActionCreator {
    constructor(
        private readonly unifiedScanResultActions: UnifiedScanResultActions,
        private readonly registerTypeToPayloadCallback: RegisterTypeToPayloadCallback,
    ) {}

    public registerCallbacks(): void {
        this.registerTypeToPayloadCallback(Messages.UnifiedScan.ScanCompleted, this.onScanCompleted);
        this.registerTypeToPayloadCallback(Messages.UnifiedScan.GetCurrentState, this.onGetScanCurrentState);
    }

    private onScanCompleted = (payload: UnifiedScanCompletedPayload): void => {
        this.unifiedScanResultActions.scanCompleted.invoke(payload);
    };

    private onGetScanCurrentState = (): void => {
        this.unifiedScanResultActions.getCurrentState.invoke(null);
    };
}
