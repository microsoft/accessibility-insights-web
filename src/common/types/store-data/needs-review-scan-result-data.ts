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
    results: UnifiedResult[];
    rules: UnifiedRule[];
    platformInfo?: PlatformData;
    toolInfo?: ToolData;
    targetAppInfo?: TargetAppData;
    timestamp?: string;
    scanIncompleteWarnings?: ScanIncompleteWarningId[];
    screenshotData?: ScreenshotData;
}
