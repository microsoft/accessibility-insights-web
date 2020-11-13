// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    UnifiedResult,
    UnifiedScanResultStoreData,
    ViewPortProperties,
} from 'common/types/store-data/unified-data-interface';
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

    return {
        screenshotData,
        highlightBoxViewModels,
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

function pxAsPercentRelativeTo(px: number, containerSizePx: number): string {
    return `${100.0 * (px / containerSizePx)}%`;
}

function getHighlightBoxViewModelFromResult(
    result: UnifiedResult,
    viewPort: ViewPortProperties,
): HighlightBoxViewModel {
    const rectInPx = result.descriptors.boundingRectangle;
    const widthInPx = rectInPx.right - rectInPx.left;
    const heightInPx = rectInPx.bottom - rectInPx.top;
    return {
        resultUid: result.uid,
        label: result.status === 'fail' ? '!' : null,
        left: pxAsPercentRelativeTo(rectInPx.left, viewPort.width),
        top: pxAsPercentRelativeTo(rectInPx.top, viewPort.height),
        width: pxAsPercentRelativeTo(widthInPx, viewPort.width),
        height: pxAsPercentRelativeTo(heightInPx, viewPort.height),
    };
}
