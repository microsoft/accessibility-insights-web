// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import { ScreenshotData } from 'common/types/store-data/unified-data-interface';
import { BoundingRectangle } from 'electron/platform/android/scan-results';
import { HighlightBox } from 'electron/views/screenshot/highlight-box';
import { Screenshot } from 'electron/views/screenshot/screenshot';
import { screenshotContainer } from 'electron/views/screenshot/screenshot-container.scss';
import * as React from 'react';

export interface ScreenshotContainerDeps {}
export interface ScreenshotContainerProps {
    deps?: ScreenshotContainerDeps;
    screenshotData: ScreenshotData;
}

const boundingRectangle: BoundingRectangle = {
    top: 0,
    bottom: 100,
    left: 0,
    right: 100,
};

export const ScreenshotContainer = NamedFC<ScreenshotContainerProps>('ScreenshotContainer', props => {
    return (
        <div className={screenshotContainer}>
            <Screenshot encodedImage={props.screenshotData.base64PngData} altText={'test'} />
            <HighlightBox deps={null} boundingRectangle={boundingRectangle} />
        </div>
    );
});
