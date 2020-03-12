// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    withStoreSubscription,
    WithStoreSubscriptionDeps,
} from 'common/components/with-store-subscription';
import { NamedFC } from 'common/react/named-fc';
import { StoresTree, StoresTreeState } from 'debug-tools/components/stores-tree';
import * as React from 'react';

export type DebugToolsViewState = StoresTreeState;

export type DebugToolsViewDeps = WithStoreSubscriptionDeps<DebugToolsViewState>;

export interface DebugToolsViewProps {
    deps: DebugToolsViewDeps;
    storeState: DebugToolsViewState;
}

export const DebugTools = NamedFC<DebugToolsViewProps>('DebugToolsView', ({ deps, storeState }) => {
    return <StoresTree deps={deps} state={storeState} />;
});

export const DebugToolsView = withStoreSubscription<DebugToolsViewProps, DebugToolsViewState>(
    DebugTools,
);
