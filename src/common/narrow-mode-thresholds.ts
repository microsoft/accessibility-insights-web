// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
export type NarrowModeThresholds = {
    collapseHeaderAndNavThreshold: number;
    collapseCommandBarThreshold: number;
    collapseVirtualKeyboardThreshold?: number;
    collapseCardFooterThreshold: number;
};

export const getNarrowModeThresholdsForWeb = (): NarrowModeThresholds => {
    return {
        collapseHeaderAndNavThreshold: 600,
        collapseCommandBarThreshold: 960,
        collapseCardFooterThreshold: 900,
    };
};

export const getNarrowModeThresholdsForUnified = (): NarrowModeThresholds => {
    return {
        collapseHeaderAndNavThreshold: 850,
        collapseCommandBarThreshold: 850,
        collapseVirtualKeyboardThreshold: 560,
        collapseCardFooterThreshold: 1100,
    };
};
