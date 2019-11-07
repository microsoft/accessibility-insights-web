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

    let highlightBoxViewModels = [];
    if (
        screenshotData != null &&
        unifiedScanResultStoreData.platformInfo != null &&
        unifiedScanResultStoreData.platformInfo.viewPortInfo != null
    ) {
        highlightBoxViewModels = getHighlightBoxViewModels(
            unifiedScanResultStoreData.results,
            highlightedResultUids,
            unifiedScanResultStoreData.platformInfo.viewPortInfo,
        );
    }

    const deviceName = (unifiedScanResultStoreData.platformInfo && unifiedScanResultStoreData.platformInfo.deviceName) || null;

    return {
        screenshotData,
        highlightBoxViewModels,
        deviceName,
    };
}

function getHighlightBoxViewModels(
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
        left: `${100.0 * (rectInPx.left / viewPort.width)}%`,
        top: `${100.0 * (rectInPx.top / viewPort.height)}%`,
        width: `${rectInPx.right - rectInPx.left}px`,
        height: `${rectInPx.bottom - rectInPx.top}px`,
    };
}
