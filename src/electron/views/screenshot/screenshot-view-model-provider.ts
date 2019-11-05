// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { UnifiedResult, UnifiedScanResultStoreData } from 'common/types/store-data/unified-data-interface';
import { BoundingRectangle } from 'electron/platform/android/scan-results';
import { ScreenshotViewModel } from './screenshot-view-model';

export type ScreenshotViewModelProvider = typeof screenshotViewModelProvider;

export function screenshotViewModelProvider(
    unifiedScanResultStoreData: UnifiedScanResultStoreData,
    highlightedResultUids: string[],
): ScreenshotViewModel {
    const screenshotData = unifiedScanResultStoreData.screenshotData;

    const highlightBoxRectangles =
        screenshotData == null ? [] : getHighlightBoxRectangles(unifiedScanResultStoreData.results, highlightedResultUids);

    const deviceName = (unifiedScanResultStoreData.platformInfo && unifiedScanResultStoreData.platformInfo.deviceName) || null;

    return {
        screenshotData,
        highlightBoxRectangles,
        deviceName,
    };
}

function getHighlightBoxRectangles(results: UnifiedResult[], highlightedUids: string[]): BoundingRectangle[] {
    const highlightedResults = results.filter(result => highlightedUids.includes(result.uid));

    return highlightedResults.map(result => result.descriptors.boundingRectangle).filter(maybeRect => maybeRect != null);
}
