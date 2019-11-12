// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import * as React from 'react';
import * as styles from './screenshot.scss';

export const screenshotImageAutomationId = 'screenshot-image';

export type ScreenshotProps = {
    encodedImage: string;
};

export const Screenshot = NamedFC<ScreenshotProps>('Screenshot', props => {
    const altText = 'axe-android results screenshot with highlighted components';

    return (
        <img
            className={styles.screenshotImage}
            src={'data:image/png;base64,' + props.encodedImage}
            alt={altText}
            data-automation-id={screenshotImageAutomationId}
        />
    );
});
