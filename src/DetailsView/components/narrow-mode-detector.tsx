// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ReactFCWithDisplayName } from 'common/react/named-fc';
import * as React from 'react';
import ReactResizeDetector from 'react-resize-detector';

export type NarrowModeDetectorProps<P = {}> = {
    isNarrowModeEnabled: boolean;
    Component: ReactFCWithDisplayName<P & { isNarrowMode: boolean }>;
    childrenProps: P;
};

const NARROW_MODE_THRESHOLD_IN_PIXEL = 600;

export function NarrowModeDetector<P>(props: NarrowModeDetectorProps<P>): JSX.Element {
    const render = (dimensions: { width: number }) => {
        const isNarrowMode =
            props.isNarrowModeEnabled === true && dimensions.width < NARROW_MODE_THRESHOLD_IN_PIXEL;
        const childrenProps = props.childrenProps;
        return <props.Component {...childrenProps} isNarrowMode={isNarrowMode} />;
    };

    return <ReactResizeDetector handleWidth querySelector="body" render={render} />;
}
