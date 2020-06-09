// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import * as React from 'react';
import ReactResizeDetector from 'react-resize-detector';

export type NarrowModeDetectorProps = {
    isNarrowModeEnabled: boolean;
    setNarrowMode: (isNarrowMode: boolean) => void;
};

const NARROW_MODE_THRESHOLD_IN_PIXEL = 600;

export const NarrowModeDetector = NamedFC<NarrowModeDetectorProps>('NarrowModeDetector', props => {
    if (props.isNarrowModeEnabled !== true) {
        return null;
    }

    const updateNarrowMode = (dimensions: { width: number }) => {
        props.setNarrowMode(dimensions.width < NARROW_MODE_THRESHOLD_IN_PIXEL);
        return <></>;
    };

    return <ReactResizeDetector handleWidth querySelector="body" render={updateNarrowMode} />;
});
