// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ScanIncompleteWarningId } from 'common/types/scan-incomplete-warnings';
import { IframeDetector } from './iframe-detector';

export interface CrossOriginPermissionDetector {
    hasCrossOriginPermissions(): boolean;
}

export class ScanIncompleteWarningDetector {
    constructor(private iframeDetector: IframeDetector, private crossOriginPermissionDetector: CrossOriginPermissionDetector) {}

    public detectScanIncompleteWarnings = () => {
        const warnings: ScanIncompleteWarningId[] = [];
        if (this.iframeDetector.hasIframes() && !this.crossOriginPermissionDetector.hasCrossOriginPermissions()) {
            warnings.push('missing-required-cross-origin-permissions');
        }
        return warnings;
    };
}
