// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DetailsViewStoreData } from 'common/types/store-data/details-view-store-data';

// There will be more SidePanel types as we keep refactoring.
export type SidePanel = 'Settings';

export type SidePanelToStoreKey = {
    [P in SidePanel]: keyof DetailsViewStoreData['currentPanel'];
};
