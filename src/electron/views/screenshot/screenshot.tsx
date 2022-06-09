// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import * as React from 'react';
import styles from './screenshot.scss';

export const screenshotImageAutomationId = 'screenshot-image';

export type ScreenshotProps = {
    encodedImage: string;
};

export const Screenshot = NamedFC<ScreenshotProps>('Screenshot', props => {
    const altText = 'axe-android results screenshot with highlighted components';

    // The tabIndex=0 is because the view is independently scrollable, which means there must always
    // be at least one focusable element inside it to enable keyboard users to scroll it. See
    // https://dequeuniversity.com/rules/axe/3.3/scrollable-region-focusable
    return (
        <img
            className={styles.screenshotImage}
            src={'data:image/png;base64,' + props.encodedImage}
            alt={altText}
            data-automation-id={screenshotImageAutomationId}
            tabIndex={0}
        />
    );
});
