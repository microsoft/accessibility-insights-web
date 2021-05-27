// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Header, HeaderDeps, HeaderProps } from 'common/components/header';
import {
    withStoreSubscription,
    WithStoreSubscriptionDeps,
} from 'common/components/with-store-subscription';
import { NamedFC } from 'common/react/named-fc';
import {
    CurrentView,
    CurrentViewDeps,
    CurrentViewState,
} from 'debug-tools/components/current-view/current-view';
import {
    DebugToolsNav,
    DebugToolsNavDeps,
    DebugToolsNavState,
} from 'debug-tools/components/debug-tools-nav';
import {
    NarrowModeDetector,
    NarrowModeDetectorDeps,
} from 'DetailsView/components/narrow-mode-detector';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react';
import * as React from 'react';
import * as styles from './debug-tools-view.scss';

export type DebugToolsViewState = DebugToolsNavState & CurrentViewState;

export type DebugToolsViewDeps = WithStoreSubscriptionDeps<DebugToolsViewState> &
    HeaderDeps &
    DebugToolsNavDeps &
    CurrentViewDeps &
    NarrowModeDetectorDeps;

export interface DebugToolsViewProps {
    deps: DebugToolsViewDeps;
    storeState: DebugToolsViewState;
}

export const DebugTools = NamedFC<DebugToolsViewProps>('DebugToolsView', ({ deps, storeState }) => {
    if (!deps.storesHub.hasStoreData()) {
        return <Spinner size={SpinnerSize.large} label="Loading" />;
    }

    const headerProps: Omit<HeaderProps, 'narrowModeStatus'> = { deps };
    return (
        <div className={styles.debugToolsContainer}>
            <NarrowModeDetector
                deps={deps}
                isNarrowModeEnabled={true}
                Component={Header}
                childrenProps={headerProps}
            />
            <DebugToolsNav deps={deps} state={storeState} className={styles.nav} />
            <CurrentView deps={deps} storeState={storeState} />
        </div>
    );
});

export const DebugToolsView =
    withStoreSubscription<DebugToolsViewProps, DebugToolsViewState>(DebugTools);
