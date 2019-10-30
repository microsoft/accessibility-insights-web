// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ScreenshotData } from 'common/types/store-data/unified-data-interface';
import { BoundingRectangle } from 'electron/platform/android/scan-results';

export type ScreenshotViewModel = {
    screenshotData: ScreenshotData;
    highlightBoxRectangles: BoundingRectangle[];
    deviceName: string;
};
