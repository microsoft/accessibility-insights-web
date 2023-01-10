// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BaseStore } from 'common/base-store';
import { PermissionsStateStoreData } from 'common/types/store-data/permissions-state-store-data';
import { ScanIncompleteWarningId } from 'common/types/store-data/scan-incomplete-warnings';
import { ScanResults } from 'scanner/iruleresults';
import { IframeDetector } from './iframe-detector';

export class ScanIncompleteWarningDetector {
    constructor(
        private iframeDetector: IframeDetector,
        private permissionsStateStore: BaseStore<PermissionsStateStoreData, Promise<void>>,
    ) {}

    public detectScanIncompleteWarnings = (results: ScanResults | null) => {
        const warnings: ScanIncompleteWarningId[] = [];

        if (
            this.iframeDetector.hasIframes() &&
            !this.permissionsStateStore.getState().hasAllUrlAndFilePermissions
        ) {
            warnings.push('missing-required-cross-origin-permissions');
        }

        if (results && results.framesSkipped) {
            warnings.push('frame-skipped');
        }

        return warnings;
    };
}
