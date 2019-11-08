// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import { ScreenshotContainer } from 'electron/views/screenshot/screenshot-container';
import { isEmpty } from 'lodash';
import * as React from 'react';
import { ScreenshotViewModel } from './screenshot-view-model';
import * as styles from './screenshot-view.scss';

export type ScreenshotViewProps = { viewModel: ScreenshotViewModel };

export const ScreenshotView = NamedFC<ScreenshotViewProps>('ScreenshotView', (props: ScreenshotViewProps) => {
    const isUnavailable = isEmpty(props.viewModel.screenshotData);

    return (
        <div role="complementary" className={styles.screenshotView}>
            {renderHeader()}
            {isUnavailable ? renderUnavailableMessage() : renderScreenshotContainer(props.viewModel)}
        </div>
    );
});

function renderHeader(): JSX.Element {
    // The tabIndex=0 is because the view is independently scrollable, which means there must always be at least one focusable element
    // inside it to enable keyboard users to scroll it. See https://dequeuniversity.com/rules/axe/3.3/scrollable-region-focusable
    //
    // Once we add the "enable visualizations" toggle, we should remove it.
    return (
        <h2 className={styles.header} tabIndex={0}>
            Target app screenshot
        </h2>
    );
}

function renderUnavailableMessage(): JSX.Element {
    return <p>Screenshot for scan is unavailable</p>;
}

function renderScreenshotContainer(nonEmptyViewModel: ScreenshotViewModel): JSX.Element {
    return (
        <ScreenshotContainer
            screenshotData={nonEmptyViewModel.screenshotData}
            highlightBoxViewModels={nonEmptyViewModel.highlightBoxViewModels}
        />
    );
}
