// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import * as React from 'react';
import { ScreenshotViewModel } from './screenshot-view-model';

export type ScreenshotViewProps = { viewModel: ScreenshotViewModel };
export const ScreenshotView = NamedFC<ScreenshotViewProps>('ScreenshotView', props => {
    return (
        <div>
            <h1 tabIndex={0}>This is the screenshot view</h1>
        </div>
    );
});
