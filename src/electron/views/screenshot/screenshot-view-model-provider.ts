// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    PlatformData,
    UnifiedResult,
    UnifiedScanResultStoreData,
} from 'common/types/store-data/unified-data-interface';
import { BoundingRectangle } from 'electron/platform/android/android-scan-results';
import { HighlightBoxViewModel, ScreenshotViewModel } from './screenshot-view-model';

export type ScreenshotViewModelProvider = typeof screenshotViewModelProvider;

export function screenshotViewModelProvider(
    unifiedScanResultStoreData: UnifiedScanResultStoreData,
    highlightedResultUids: string[],
): ScreenshotViewModel {
    const screenshotData = unifiedScanResultStoreData.screenshotData;
    const viewPortInfo = tryGetViewPort(unifiedScanResultStoreData.platformInfo);

    let highlightBoxViewModels: HighlightBoxViewModel[] = [];
    if (screenshotData != null && viewPortInfo != null) {
        highlightBoxViewModels = getHighlightBoxViewModels(
            unifiedScanResultStoreData.results,
            highlightedResultUids,
            viewPortInfo,
        );
    }

    return {
        screenshotData,
        highlightBoxViewModels,
    };
}

type RequiredViewPortProperties = {
    width: number;
    height: number;
};

function tryGetViewPort(platformInfo?: PlatformData): RequiredViewPortProperties | null {
    const viewPortInfo = platformInfo?.viewPortInfo ?? {};
    const { width, height } = viewPortInfo;
    if (width != null && height != null) {
        return { width, height };
    }
    return null;
}

function getHighlightBoxViewModels(
    results: UnifiedResult[],
    highlightedUids: string[],
    viewPort: RequiredViewPortProperties,
): HighlightBoxViewModel[] {
    return results
        .filter(result => highlightedUids.includes(result.uid))
        .filter(result => result.descriptors.boundingRectangle != null)
        .map(result =>
            getHighlightBoxViewModelFromResult(
                result,
                result.descriptors.boundingRectangle!,
                viewPort,
            ),
        );
}

function pxAsPercentRelativeTo(px: number, containerSizePx: number): string {
    return `${100.0 * (px / containerSizePx)}%`;
}

function getHighlightBoxViewModelFromResult(
    result: UnifiedResult,
    rectInPx: BoundingRectangle,
    viewPort: RequiredViewPortProperties,
): HighlightBoxViewModel {
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
