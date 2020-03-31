// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import {
    PlatformData,
    UnifiedResult,
    ViewPortProperties,
} from 'common/types/store-data/unified-data-interface';

import { HighlightState } from 'common/components/cards/instance-details-footer';

import { BoundingRectangle } from 'electron/platform/android/scan-results';

export type GetUnavailableHighlightStatus = (
    result: UnifiedResult,
    platformInfo: PlatformData,
) => HighlightState;

export const getUnavailableHighlightStatusUnified: GetUnavailableHighlightStatus = (
    result,
    platformInfo,
) => {
    if (
        platformInfo == null ||
        result.descriptors.boundingRectangle == null ||
        !hasValidBoundingRectangle(result.descriptors.boundingRectangle, platformInfo.viewPortInfo)
    ) {
        return 'unavailable';
    }

    return null;
};

function hasValidBoundingRectangle(
    boundingRectangle: BoundingRectangle,
    viewPort: ViewPortProperties,
): boolean {
    return !(boundingRectangle.left > viewPort.width || boundingRectangle.top > viewPort.height);
}

export const getUnavailableHighlightStatusWeb: GetUnavailableHighlightStatus = () => null;
