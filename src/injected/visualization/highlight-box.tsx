// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { css } from '@fluentui/utilities';
import { NamedFC } from 'common/react/named-fc';
import { CSSProperties } from 'react';
import * as React from 'react';

import { BoxConfig, SimpleHighlightDrawerConfiguration } from './formatter';

export interface HighlightBoxDeps {}
export interface HighlightBoxProps {
    deps: HighlightBoxDeps;
    className?: string;
    drawerConfig: SimpleHighlightDrawerConfiguration;
    boxConfig: BoxConfig;
    onClickHandler?: () => void;
}

export const HighlightBox = NamedFC<HighlightBoxProps>('HighlightBox', props => {
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

    const combinedClass = css('insights-highlight-text', className);

    return (
        <div className={combinedClass} onClick={onClickHandler} style={styles}>
            {boxConfig.text}
        </div>
    );
});
