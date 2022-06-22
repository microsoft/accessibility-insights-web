// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import styles from 'electron/views/screenshot/highlight-box.scss';
import { HighlightBoxViewModel } from 'electron/views/screenshot/screenshot-view-model';
import * as React from 'react';
import { CSSProperties } from 'react';

export const highlightBoxAutomationId = 'screenshot-highlight-box';

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
    const renderedLabel =
        viewModel.label == null ? null : (
            <div className={styles.highlightBoxLabel}>{viewModel.label}</div>
        );

    return (
        <div
            className={styles.highlightBox}
            style={boxStyles}
            aria-hidden="true"
            data-automation-id={highlightBoxAutomationId}
        >
            {renderedLabel}
        </div>
    );
});
