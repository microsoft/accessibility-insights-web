// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { UnifiedResult, UnifiedScanResultStoreData, ViewPortProperties } from 'common/types/store-data/unified-data-interface';
import { HighlightBoxViewModel, ScreenshotViewModel } from './screenshot-view-model';

export type ScreenshotViewModelProvider = typeof screenshotViewModelProvider;

export function screenshotViewModelProvider(
    unifiedScanResultStoreData: UnifiedScanResultStoreData,
    highlightedResultUids: string[],
): ScreenshotViewModel {
    const screenshotData = unifiedScanResultStoreData.screenshotData;

    const highlightBoxViewModels =
        screenshotData == null
            ? []
            : getHighlightBoxRectangles(
                  unifiedScanResultStoreData.results,
                  highlightedResultUids,
                  unifiedScanResultStoreData.platformInfo.viewPortInfo,
              );

    return {
        screenshotData,
        highlightBoxViewModels,
        deviceName: null, // Future work will want to pipe this in via unifiedScanResultStore.platformInfo
    };
}

function getHighlightBoxRectangles(
    results: UnifiedResult[],
    highlightedUids: string[],
    viewPort: ViewPortProperties,
): HighlightBoxViewModel[] {
    return results
        .filter(result => highlightedUids.includes(result.uid))
        .filter(result => result.descriptors.boundingRectangle != null)
        .map(result => getHighlightBoxViewModelFromResult(result, viewPort));
}

function getHighlightBoxViewModelFromResult(result: UnifiedResult, viewPort: ViewPortProperties): HighlightBoxViewModel {
    const rectInPx = result.descriptors.boundingRectangle;
    return {
        resultUid: result.uid,
        left: `${rectInPx.left / viewPort.width}%`,
        top: `${rectInPx.top / viewPort.height}%`,
        width: `${rectInPx.right - rectInPx.left}px`,
        height: `${rectInPx.bottom - rectInPx.top}px`,
    };
}
