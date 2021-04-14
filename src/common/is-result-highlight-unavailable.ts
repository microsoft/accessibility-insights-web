// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { PlatformData, UnifiedResult } from 'common/types/store-data/unified-data-interface';
import { BoundingRectangle } from 'electron/platform/android/android-scan-results';

export type IsResultHighlightUnavailable = (
    result: UnifiedResult,
    platformInfo: PlatformData | null,
) => boolean;

export const isResultHighlightUnavailableUnified: IsResultHighlightUnavailable = (
    result,
    platformInfo,
) => {
    if (
        platformInfo?.viewPortInfo?.width == null ||
        platformInfo?.viewPortInfo?.height == null ||
        result.descriptors.boundingRectangle == null ||
        !hasValidBoundingRectangle(
            result.descriptors.boundingRectangle,
            platformInfo.viewPortInfo.width,
            platformInfo.viewPortInfo.height,
        )
    ) {
        return true;
    }

    return false;
};

function hasValidBoundingRectangle(
    boundingRectangle: BoundingRectangle,
    viewPortWidth: number,
    viewPortHeight: number,
): boolean {
    return !(
        boundingRectangle.right <= 0 ||
        boundingRectangle.bottom <= 0 ||
        boundingRectangle.left > viewPortWidth ||
        boundingRectangle.top > viewPortHeight
    );
}

export const isResultHighlightUnavailableWeb: IsResultHighlightUnavailable = () => false;
