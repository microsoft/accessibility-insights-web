// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

export type electronRoutes = 'deviceConnectView' | 'resultsView';

export interface ElectronWindowStateStoreData {
    routeId: electronRoutes;
}
