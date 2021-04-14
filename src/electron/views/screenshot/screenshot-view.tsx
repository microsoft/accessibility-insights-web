// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import * as styles from 'electron/views/screenshot/common-visual-helper-section-styles.scss';
import { ScreenshotContainer } from 'electron/views/screenshot/screenshot-container';
import { isEmpty } from 'lodash';
import * as React from 'react';
import { ScreenshotViewModel } from './screenshot-view-model';

export const screenshotViewAutomationId = 'screenshot-view';

export type ScreenshotViewProps = { viewModel: ScreenshotViewModel };

export const ScreenshotView = NamedFC<ScreenshotViewProps>(
    'ScreenshotView',
    (props: ScreenshotViewProps) => {
        return (
            <div
                role="complementary"
                className={styles.visualHelperSection}
                data-automation-id={screenshotViewAutomationId}
            >
                {renderHeader()}
                {renderScreenshotContainer(props.viewModel)}
            </div>
        );
    },
);

function renderHeader(): JSX.Element {
    return <h2 className={styles.header}>Target app screenshot</h2>;
}

function renderUnavailableMessage(): JSX.Element {
    return <p>Screenshot for scan is unavailable</p>;
}

function renderScreenshotContainer(viewModel: ScreenshotViewModel): JSX.Element {
    if (isEmpty(viewModel.screenshotData)) {
        return renderUnavailableMessage();
    }

    return (
        <ScreenshotContainer
            screenshotData={viewModel.screenshotData!}
            highlightBoxViewModels={viewModel.highlightBoxViewModels}
        />
    );
}
