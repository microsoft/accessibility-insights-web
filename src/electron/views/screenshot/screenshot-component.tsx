// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import * as React from 'react';

export type ScreenshotComponentProps = {
    image: string;
    alt: string;
};

export const ScreenshotComponent = NamedFC<ScreenshotComponentProps>('ScreenshotComponent', props => {
    return <img src={'data:image/png;base64,' + props.image} alt={props.alt} />;
});
