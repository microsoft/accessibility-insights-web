// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Header, HeaderDeps, HeaderProps } from 'common/components/header';
import {
    withStoreSubscription,
    WithStoreSubscriptionDeps,
} from 'common/components/with-store-subscription';
import { FeatureFlags } from 'common/feature-flags';
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
import { NarrowModeDetector } from 'DetailsView/components/narrow-mode-detector';
import * as React from 'react';
import * as styles from './debug-tools-view.scss';

export type DebugToolsViewState = DebugToolsNavState & CurrentViewState;

export type DebugToolsViewDeps = WithStoreSubscriptionDeps<DebugToolsViewState> &
    HeaderDeps &
    DebugToolsNavDeps &
    CurrentViewDeps;

export interface DebugToolsViewProps {
    deps: DebugToolsViewDeps;
    storeState: DebugToolsViewState;
}

export const DebugTools = NamedFC<DebugToolsViewProps>('DebugToolsView', ({ deps, storeState }) => {
    const headerProps: Omit<HeaderProps, 'isNarrowMode'> = { deps };
    return (
        <div className={styles.debugToolsContainer}>
            <NarrowModeDetector
                isNarrowModeEnabled={storeState.featureFlagStoreData[FeatureFlags.reflowUI]}
                Component={Header}
                childrenProps={headerProps}
            />
            <Header deps={deps} />
            <DebugToolsNav deps={deps} state={storeState} className={styles.nav} />
            <CurrentView deps={deps} storeState={storeState} />
        </div>
    );
});

export const DebugToolsView = withStoreSubscription<DebugToolsViewProps, DebugToolsViewState>(
    DebugTools,
);
