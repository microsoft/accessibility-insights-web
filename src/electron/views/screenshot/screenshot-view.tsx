// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import { ScreenshotContainer } from 'electron/views/screenshot/screenshot-container';
import * as React from 'react';
import { ScreenshotViewModel } from './screenshot-view-model';

export type ScreenshotViewProps = { viewModel: ScreenshotViewModel };

export const ScreenshotView = NamedFC<ScreenshotViewProps>('ScreenshotView', (props: ScreenshotViewProps) => {
    return (
        <div>
            <h1 tabIndex={0}>Target Page Screenshot</h1>
            <ScreenshotContainer screenshotData={props.viewModel.screenshotData} />
        </div>
    );
});
