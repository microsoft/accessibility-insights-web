// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import { BoundingRectangle } from 'electron/platform/android/scan-results';
import { highlightBox, highlightBoxLabel } from 'electron/views/highlight-box/highlight-box.scss';
import * as React from 'react';
import { CSSProperties } from 'react';

export interface HighlightBoxDeps {}
export interface HighlightBoxProps {
    deps: HighlightBoxDeps;
    boundingRectangle: BoundingRectangle;
}

export const HighlightBox = NamedFC<HighlightBoxProps>('HighlightBox', props => {
    const { boundingRectangle } = props;

    const width = boundingRectangle.right - boundingRectangle.left;
    const height = boundingRectangle.bottom - boundingRectangle.top;

    const boxStyles: CSSProperties = {
        width: `${width}px`,
        height: `${height}px`,
        top: `${boundingRectangle.top}px`,
        left: `${boundingRectangle.left}px`,
    };

    return (
        <div className={highlightBox} style={boxStyles}>
            <div className={highlightBoxLabel}>!</div>
        </div>
    );
});
