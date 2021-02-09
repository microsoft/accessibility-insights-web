// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ReactFCWithDisplayName } from 'common/react/named-fc';
import { NarrowModeThresholds } from 'electron/common/narrow-mode-thresholds';
import * as React from 'react';
import ReactResizeDetector from 'react-resize-detector';

export type NarrowModeStatus = {
    isHeaderAndNavCollapsed: boolean;
    isCommandBarCollapsed: boolean;
    isVirtualKeyboardCollapsed: boolean;
};

export type NarrowModeDetectorDeps = {
    getNarrowModeThresholds: () => NarrowModeThresholds;
};

export type NarrowModeDetectorProps<P = { narrowModeStatus: NarrowModeStatus }> = {
    deps: NarrowModeDetectorDeps;
    isNarrowModeEnabled: boolean;
    Component:
        | ReactFCWithDisplayName<P & { narrowModeStatus: NarrowModeStatus }>
        | React.ComponentClass<P & { narrowModeStatus: NarrowModeStatus }>;
    childrenProps: P;
};

export function getNarrowModeComponentWrapper<P>(
    props: NarrowModeDetectorProps<P>,
): (dimensions: { width: number }) => JSX.Element {
    return (dimensions: { width: number }) => {
        const childrenProps = props.childrenProps;
        const isNarrowModeEnabled = props.isNarrowModeEnabled === true;
        const narrowModeThresholds = props.deps.getNarrowModeThresholds();

        const isNarrowerThan = (threshold: number | undefined) =>
            threshold ? threshold > dimensions.width : false;

        const narrowModeStatus = {
            isHeaderAndNavCollapsed:
                isNarrowModeEnabled &&
                isNarrowerThan(narrowModeThresholds.collapseHeaderAndNavThreshold),
            isCommandBarCollapsed:
                isNarrowModeEnabled &&
                isNarrowerThan(narrowModeThresholds.collapseCommandBarThreshold),
            isVirtualKeyboardCollapsed:
                isNarrowModeEnabled &&
                isNarrowerThan(narrowModeThresholds.collapseVirtualKeyboardThreshold),
        };
        return <props.Component {...childrenProps} narrowModeStatus={narrowModeStatus} />;
    };
}

export function NarrowModeDetector<P>(props: NarrowModeDetectorProps<P>): JSX.Element {
    return (
        <ReactResizeDetector handleWidth={true} handleHeight={false} querySelector="body">
            {getNarrowModeComponentWrapper(props)}
        </ReactResizeDetector>
    );
}
