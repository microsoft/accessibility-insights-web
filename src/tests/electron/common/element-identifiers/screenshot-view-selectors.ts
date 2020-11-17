// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { highlightBoxAutomationId } from 'electron/views/screenshot/highlight-box';
import { screenshotImageAutomationId } from 'electron/views/screenshot/screenshot';
import { screenshotViewAutomationId } from 'electron/views/screenshot/screenshot-view';
import { getAutomationIdSelector } from 'tests/common/get-automation-id-selector';

export const ScreenshotViewSelectors = {
    screenshotView: getAutomationIdSelector(screenshotViewAutomationId),
    screenshotImage: getAutomationIdSelector(screenshotImageAutomationId),
    highlightBox: getAutomationIdSelector(highlightBoxAutomationId),
    getHighlightBoxByIndex: (index: number) =>
        `${ScreenshotViewSelectors.highlightBox}:nth-of-type(${index})`,
};
