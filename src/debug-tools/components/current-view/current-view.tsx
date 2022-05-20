// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import { DebugToolsNavState } from 'debug-tools/components/debug-tools-nav';
import { StoresTree, StoresTreeDeps, StoresTreeState } from 'debug-tools/components/stores-tree';
import {
    TelemetryViewer,
    TelemetryViewerDeps,
} from 'debug-tools/components/telemetry-viewer/telemetry-viewer';
import * as React from 'react';
import styles from '../debug-tools-view.scss';

export type CurrentViewState = StoresTreeState & DebugToolsNavState;
export type CurrentViewDeps = TelemetryViewerDeps & StoresTreeDeps;
export type CurrentViewProps = {
    deps: CurrentViewDeps;
    storeState: CurrentViewState;
};

const componentRegistry = {
    ['telemetryViewer']: TelemetryViewer,
    ['stores']: StoresTree,
};

export const CurrentView = NamedFC<CurrentViewProps>('CurrentView', ({ deps, storeState }) => {
    const selectedTool = storeState.debugToolsNavStoreData.selectedTool;
    const Content = componentRegistry[selectedTool];

    return (
        <main className={styles.main}>
            <Content deps={deps} state={storeState} />
        </main>
    );
});
