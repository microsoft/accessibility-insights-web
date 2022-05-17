// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { ScanIncompleteWarningId } from 'common/types/scan-incomplete-warnings';
import {
    PlatformData,
    ScreenshotData,
    TargetAppData,
    ToolData,
    UnifiedResult,
    UnifiedRule,
} from 'common/types/store-data/unified-data-interface';

export interface NeedsReviewScanResultStoreData {
    results: UnifiedResult[] | null;
    rules: UnifiedRule[] | null;
    platformInfo?: PlatformData | null;
    toolInfo?: ToolData | null;
    targetAppInfo?: TargetAppData | null;
    timestamp?: string | null;
    scanIncompleteWarnings?: ScanIncompleteWarningId[] | null;
    screenshotData?: ScreenshotData | null;
}
