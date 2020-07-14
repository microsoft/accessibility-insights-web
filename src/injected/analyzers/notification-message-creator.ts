// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { ScanIncompleteWarningId } from 'common/types/scan-incomplete-warnings';
import { ScanIncompleteWarningDetector } from 'injected/scan-incomplete-warning-detector';

export class NotificationMessageCreator {
    constructor(private scanIncompleteWarningDetector: ScanIncompleteWarningDetector) {}

    public automatedChecksMessage = () => {
        return null;
    };

    public needsReviewMessage = (a: any, scan: ScanIncompleteWarningId[]) => {
        return null;
    };
}
