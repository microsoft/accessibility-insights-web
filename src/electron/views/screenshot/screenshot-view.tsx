// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import { isEmpty } from 'lodash';
import * as React from 'react';

import { Screenshot } from './screenshot';
import { ScreenshotViewModel } from './screenshot-view-model';

export type ScreenshotViewProps = {
    viewModel: ScreenshotViewModel;
};

const screenshotAltText: string = 'axe-android results screenshot with highlighted components';

export const ScreenshotView = NamedFC<ScreenshotViewProps>('ScreenshotView', (props: ScreenshotViewProps) => {
    if (isEmpty(props.viewModel.screenshotData)) {
        return <div>Screenshot for scan is unavailable</div>;
    }
    /* note the h1 below has a tab index because the screenshot image is scrollable and keyboard users need to be able to
    navigate via tab per https://dequeuniversity.com/rules/axe/3.3/scrollable-region-focusable */
    return (
        <div>
            <h1 tabIndex={0}>Target Page Screenshot</h1>
            <Screenshot encodedImage={props.viewModel.screenshotData.base64PngData} altText={screenshotAltText} />
            {renderDeviceNameCaption(props.viewModel.deviceName)}
        </div>
    );
});

function renderDeviceNameCaption(deviceName?: string): JSX.Element {
    return deviceName == null ? null : <caption>{deviceName}</caption>;
}
