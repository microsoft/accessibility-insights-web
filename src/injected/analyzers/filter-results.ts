// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { ScanResults } from 'scanner/iruleresults';

export type FilterResults = (scanResults: ScanResults) => ScanResults;

export const filterNeedsReviewResults = (results: ScanResults): ScanResults => {
    results.violations = results.violations.filter(
        v =>
            v.id !== 'aria-input-field-name' &&
            v.id !== 'color-contrast' &&
            v.id !== 'th-has-data-cells',
    );
    results.incomplete = results.incomplete.filter(i => i.id !== 'label-content-name-mismatch');

    return results;
};
