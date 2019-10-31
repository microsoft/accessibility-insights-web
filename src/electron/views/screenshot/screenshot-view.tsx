// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import * as React from 'react';

export type ScreenshotViewProps = {};
export const ScreenshotView = NamedFC<ScreenshotViewProps>('ScreenshotView', props => {
    return (
        <div>
            <h1>This is the screenshot view</h1>
        </div>
    );
});
