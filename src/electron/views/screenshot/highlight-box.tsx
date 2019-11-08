// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import { highlightBox, highlightBoxLabel } from 'electron/views/screenshot/highlight-box.scss';
import { HighlightBoxViewModel } from 'electron/views/screenshot/screenshot-view-model';
import * as React from 'react';
import { CSSProperties } from 'react';

export interface HighlightBoxProps {
    viewModel: HighlightBoxViewModel;
}

export const HighlightBox = NamedFC<HighlightBoxProps>('HighlightBox', props => {
    const { viewModel } = props;

    const boxStyles: CSSProperties = {
        width: viewModel.width,
        height: viewModel.height,
        top: viewModel.top,
        left: viewModel.left,
    };

    return (
        <div className={highlightBox} style={boxStyles} aria-hidden="true">
            <div className={highlightBoxLabel}>!</div>
        </div>
    );
});
