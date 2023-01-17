// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { ScanIncompleteWarningId } from 'common/types/store-data/scan-incomplete-warnings';
import { UnifiedResult } from 'common/types/store-data/unified-data-interface';
import { ScanIncompleteWarningDetector } from 'injected/scan-incomplete-warning-detector';
import { isEmpty } from 'lodash';

export type TextGenerator = (unifiedResults: UnifiedResult[]) => string | null;

export class NotificationTextCreator {
    constructor(private scanIncompleteWarningDetector: ScanIncompleteWarningDetector) {}

    public automatedChecksText: TextGenerator = (results: UnifiedResult[]) => {
        return null;
    };

    public needsReviewText: TextGenerator = (results: UnifiedResult[]) => {
        const warnings = this.scanIncompleteWarningDetector.detectScanIncompleteWarnings(null);
        if (isEmpty(results) && isEmpty(warnings)) {
            return 'Congratulations!\n\nNeeds review found no instances to review on this page.';
        }

        const base = getTextBase(results);
        const prefix = getTextPrefix(warnings);

        return `${prefix}${base}`;
    };
}

const getTextPrefix = (warnings: ScanIncompleteWarningId[]): string => {
    if (warnings.indexOf('missing-required-cross-origin-permissions') >= 0) {
        return 'There are iframes in the target page. Use FastPass or Assessment to provide additional permissions.\n';
    }

    return '';
};

const getTextBase = (results: UnifiedResult[]): string => {
    return isEmpty(results)
        ? 'No instances to review found.'
        : 'Needs review found instances to review.';
};
