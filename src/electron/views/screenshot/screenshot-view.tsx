// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import { ScreenshotData } from 'common/types/store-data/unified-data-interface';
import { isEmpty, isUndefined } from 'lodash';
import * as React from 'react';

import { Screenshot } from './screenshot';

export type ScreenshotViewProps = {
    screenshotData: ScreenshotData;
};

const screenshotAltText: string = 'axe-android results screenshot with highlighted components';

export const ScreenshotView = NamedFC<ScreenshotViewProps>('ScreenshotView', (props: ScreenshotViewProps) => {
    if (isUndefined(props.screenshotData) || isEmpty(props.screenshotData)) {
        return (
            <div>
                <p>Screenshot for scan is unavailable</p>
            </div>
        );
    } else {
        return (
            <div>
                <h1 tabIndex={0}>Page state screenshot</h1>
                <Screenshot encodedImage={props.screenshotData.base64PngData} altText={screenshotAltText} />
            </div>
        );
    }
});
