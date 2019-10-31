// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ScreenshotData } from 'common/types/store-data/unified-data-interface';
import { BoundingRectangle } from 'electron/platform/android/scan-results';

export type ScreenshotViewModel = {
    // "screenshotData == null" means that the view should show a "screenshot unavailable" message
    screenshotData?: ScreenshotData;
    highlightBoxRectangles: BoundingRectangle[];
    // "deviceName == null" means that the view should omit the "device name" subtitle
    deviceName?: string;
};
