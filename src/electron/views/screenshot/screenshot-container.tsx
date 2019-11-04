// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import { ScreenshotData } from 'common/types/store-data/unified-data-interface';
import { BoundingRectangle } from 'electron/platform/android/scan-results';
import { HighlightBox } from 'electron/views/screenshot/highlight-box';
import { Screenshot } from 'electron/views/screenshot/screenshot';
import { screenshotContainer } from 'electron/views/screenshot/screenshot-container.scss';
import { isEmpty } from 'lodash';
import * as React from 'react';

export interface ScreenshotContainerDeps {}
export interface ScreenshotContainerProps {
    deps?: ScreenshotContainerDeps;
    screenshotData: ScreenshotData;
    highlightBoxes?: BoundingRectangle[];
}

export const ScreenshotContainer = NamedFC<ScreenshotContainerProps>('ScreenshotContainer', props => {
    if (isEmpty(props.screenshotData)) {
        return <div>Screenshot for scan is unavailable</div>;
    }
    return (
        <div className={screenshotContainer}>
            <Screenshot encodedImage={props.screenshotData.base64PngData} />
            {renderHighlightBoxes(props.highlightBoxes)}
        </div>
    );
});

function renderHighlightBoxes(highlightBoxes: BoundingRectangle[]): JSX.Element[] {
    const renderedBoxes: JSX.Element[] = [];
    let keyId = 1;
    highlightBoxes.forEach(instance => {
        renderedBoxes.push(<HighlightBox key={keyId} boundingRectangle={instance} />);
        keyId++;
    });
    return renderedBoxes;
}
