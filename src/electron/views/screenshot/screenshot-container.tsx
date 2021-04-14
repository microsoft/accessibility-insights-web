// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import { ScreenshotData } from 'common/types/store-data/unified-data-interface';
import { HighlightBox } from 'electron/views/screenshot/highlight-box';
import { Screenshot } from 'electron/views/screenshot/screenshot';
import { screenshotContainer } from 'electron/views/screenshot/screenshot-container.scss';
import { HighlightBoxViewModel } from 'electron/views/screenshot/screenshot-view-model';
import { isEmpty } from 'lodash';
import * as React from 'react';

export interface ScreenshotContainerProps {
    screenshotData: ScreenshotData;
    highlightBoxViewModels: HighlightBoxViewModel[];
}

export const ScreenshotContainer = NamedFC<ScreenshotContainerProps>(
    'ScreenshotContainer',
    props => {
        return (
            <div className={screenshotContainer}>
                <Screenshot encodedImage={props.screenshotData.base64PngData} />
                {renderHighlightBoxes(props.highlightBoxViewModels)}
            </div>
        );
    },
);

function renderHighlightBoxes(
    highlightBoxViewModels: HighlightBoxViewModel[],
): JSX.Element[] | null {
    if (isEmpty(highlightBoxViewModels)) {
        return null;
    }

    return highlightBoxViewModels.map(viewModel => (
        <HighlightBox key={viewModel.resultUid} viewModel={viewModel} />
    ));
}
