import { WindowStateStore } from 'electron/flux/store/window-state-store';
import { ClientStoresHub } from 'common/stores/client-stores-hub';

// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

export type ResultViewContainerDeps = {
    storeHub: ClientStoresHub<WindowStateStore>;
};

export type ResultViewContainerProps = {
    deps: ResultViewContainerDeps;
};
