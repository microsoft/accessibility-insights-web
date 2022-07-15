// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { ScanIncompleteWarningId } from './scan-incomplete-warnings';
import {
    PlatformData,
    ScreenshotData,
    TargetAppData,
    ToolData,
    UnifiedResult,
    UnifiedRule,
} from './unified-data-interface';

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
