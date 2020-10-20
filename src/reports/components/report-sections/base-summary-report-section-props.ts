// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { ScanMetadata } from 'common/types/store-data/unified-data-interface';

export type BaseSummaryReportSectionProps = {
    toUtcString: (date: Date) => string;
    secondsToTimeString: (seconds: number) => string;
    getCollapsibleScript: () => string;
    scanMetadata: ScanMetadata;
};
