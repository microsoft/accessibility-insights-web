// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { getStoreStateMessage, Messages } from '../../common/messages';
import { StoreNames } from '../../common/stores/store-names';
import { Interpreter } from '../interpreter';
import { UnifiedScanCompletedPayload } from './action-payloads';
import { UnifiedScanResultActions } from './unified-scan-result-actions';

export class UnifiedScanResultActionCreator {
    constructor(private readonly interpreter: Interpreter, private readonly unifiedScanResultActions: UnifiedScanResultActions) {}

    public registerCallbacks(): void {
        this.interpreter.registerTypeToPayloadCallback(Messages.UnifiedScan.ScanCompleted, this.onScanCompleted);
        this.interpreter.registerTypeToPayloadCallback(getStoreStateMessage(StoreNames.UnifiedScanResultStore), this.onGetScanCurrentState);
    }

    private onScanCompleted = (payload: UnifiedScanCompletedPayload): void => {
        this.unifiedScanResultActions.scanCompleted.invoke(payload);
    };

    private onGetScanCurrentState = (): void => {
        this.unifiedScanResultActions.getCurrentState.invoke(null);
    };
}
