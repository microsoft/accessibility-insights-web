// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
const largestSupportedZoomFactor = 4; // 400%
const smallestSupportedScreenWidth = 1280;
const smallestSupportedScreenHeight = 1024;

export const mainWindowConfig = {
    defaultWidth: 600,
    defaultHeight: 391,
    minWidth: smallestSupportedScreenWidth / largestSupportedZoomFactor,
    minHeight: smallestSupportedScreenHeight / largestSupportedZoomFactor,
};
