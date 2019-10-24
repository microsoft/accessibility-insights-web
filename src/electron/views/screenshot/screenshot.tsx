// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import * as React from 'react';

export type ScreenshotProps = {
    encodedImage: string;
    altText: string;
};

export const Screenshot = NamedFC<ScreenshotProps>('Screenshot', props => {
    return <img src={'data:image/png;base64,' + props.encodedImage} alt={props.altText} />;
});
