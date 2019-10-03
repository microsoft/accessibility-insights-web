// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

export type ViewRoutes = 'deviceConnectView' | 'resultsView';

export interface WindowStateStoreData {
    routeId: ViewRoutes;
}
