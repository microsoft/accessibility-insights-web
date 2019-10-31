// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import { highlightBox, highlightBoxLabel } from 'electron/views/highlight-box/highlight-box.scss';
import { BoxConfig } from 'injected/visualization/formatter';
import * as React from 'react';
import { CSSProperties } from 'react';

export interface HighlightBoxDeps {
    width: string;
    height: string;
    top: string;
    left: string;
}
export interface HighlightBoxProps {
    deps: HighlightBoxDeps;
    boxConfig: BoxConfig;
}

export const HighlightBox = NamedFC<HighlightBoxProps>('HighlightBox', props => {
    const { deps, boxConfig } = props;
    if (boxConfig == null) {
        return null;
    }
    const boxStyles: CSSProperties = {
        background: boxConfig.background,
        outline: boxConfig.outline,
        width: deps.width,
        height: deps.height,
        top: deps.top,
        left: deps.left,
    };

    const labelStyles: CSSProperties = {
        color: boxConfig.fontColor,
    };

    return (
        <div className={highlightBox} style={boxStyles}>
            <div className={highlightBoxLabel} style={labelStyles}>
                {boxConfig.text}
            </div>
        </div>
    );
});
