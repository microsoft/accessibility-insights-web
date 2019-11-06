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

export interface ScreenshotContainerProps {
    screenshotData?: ScreenshotData;
    highlightBoxRectangles: BoundingRectangle[];
}

export const ScreenshotContainer = NamedFC<ScreenshotContainerProps>('ScreenshotContainer', props => {
    if (isEmpty(props.screenshotData)) {
        return <div>Screenshot for scan is unavailable</div>;
    }

    return (
        <div className={screenshotContainer}>
            <Screenshot encodedImage={props.screenshotData.base64PngData} />
            {renderHighlightBoxes(props.highlightBoxRectangles)}
        </div>
    );
});

function renderHighlightBoxes(highlightBoxRectangles: BoundingRectangle[]): JSX.Element[] {
    if (isEmpty(highlightBoxRectangles)) {
        return;
    }

    const renderedBoxes: JSX.Element[] = [];

    // When making the highlight boxes interactive, it would be better to use the result uid as the key, so
    // the mapping between results and highlight boxes is maintained if boxes are added/removed from the list.
    highlightBoxRectangles.forEach((rectangle, index) => {
        renderedBoxes.push(<HighlightBox key={index} boundingRectangle={rectangle} />);
    });

    return renderedBoxes;
}
