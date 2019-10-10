// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

export type ViewRoutes = 'deviceConnectView' | 'resultsView';
export type WindowStates = 'restoredOrMaximized' | 'minimized';

export interface WindowStateStoreData {
    routeId: ViewRoutes;
    currentWindowState: WindowStates;
}
