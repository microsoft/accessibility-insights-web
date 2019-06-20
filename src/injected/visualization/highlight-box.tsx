// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { CSSProperties } from 'react';
import * as React from 'react';

import { NamedSFC } from '../../common/react/named-sfc';
import { BoxConfig, SimpleHighlightDrawerConfiguration } from './formatter';

export interface HightlightBoxDeps {}
export interface HightlightBoxProps {
    deps: HightlightBoxDeps;
    className?: string;
    drawerConfig: SimpleHighlightDrawerConfiguration;
    boxConfig: BoxConfig;
    onClickHandler?: () => void;
}

export const HightlightBox = NamedSFC<HightlightBoxProps>('HighlightBox', props => {
    const { boxConfig, drawerConfig, className, onClickHandler } = props;
    if (boxConfig == null) {
        return null;
    }
    const styles: CSSProperties = {
        background: boxConfig.background,
        color: boxConfig.fontColor,
        width: boxConfig.boxWidth,
        cursor: drawerConfig.cursor,
        textAlign: drawerConfig.textAlign,
    };

    const combinedClass = 'insights-highlight-text ' + className;

    return (
        <div className={combinedClass} onClick={onClickHandler} style={styles}>
            {boxConfig.text}
        </div>
    );
});
