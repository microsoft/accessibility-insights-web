// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { FeatureFlagStoreData } from '../../common/types/store-data/feature-flag-store-data';

export interface Drawer {
    initialize(config: DrawerInitData<any>): void;
    isOverlayEnabled: boolean;
    drawLayout(): Promise<void>;
    eraseLayout(): void;
}

export interface DrawerInitData<T> {
    data: T[];
    featureFlagStoreData: FeatureFlagStoreData;
}
