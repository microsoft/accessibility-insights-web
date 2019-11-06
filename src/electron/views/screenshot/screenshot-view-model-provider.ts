// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { UnifiedResult, UnifiedScanResultStoreData, ViewPortProperties } from 'common/types/store-data/unified-data-interface';
import { BoundingRectangle } from 'electron/platform/android/scan-results';
import { ScreenshotViewModel } from './screenshot-view-model';

export type ScreenshotViewModelProvider = typeof screenshotViewModelProvider;

export function screenshotViewModelProvider(
    unifiedScanResultStoreData: UnifiedScanResultStoreData,
    highlightedResultUids: string[],
): ScreenshotViewModel {
    const screenshotData = unifiedScanResultStoreData.screenshotData;

    const highlightBoxRectangles =
        screenshotData == null
            ? []
            : getHighlightBoxRectangles(
                  unifiedScanResultStoreData.results,
                  highlightedResultUids,
                  unifiedScanResultStoreData.platformInfo.viewPortInfo,
              );

    return {
        screenshotData,
        highlightBoxRectangles,
        deviceName: null, // Future work will want to pipe this in via unifiedScanResultStore.platformInfo
    };
}

export type HighlightBoxViewModel = {
    left: string;
    top: string;
    width: string;
    height: string;
};
function getHighlightBoxRectangles(
    results: UnifiedResult[],
    highlightedUids: string[],
    viewPort: ViewPortProperties,
): HighlightBoxViewModel[] {
    return results
        .filter(result => highlightedUids.includes(result.uid))
        .map(highlightedResult => highlightedResult.descriptors.boundingRectangle)
        .filter(maybeRect => maybeRect != null)
        .map(rectInPx => ({
            left: `${rectInPx.left / viewPort.height}%`,
            top: `${rectInPx.top / viewPort.height}%`,
            width: `${rectInPx.right - rectInPx.left}px`,
            height: `${rectInPx.bottom - rectInPx.top}px`,
        }));
}
