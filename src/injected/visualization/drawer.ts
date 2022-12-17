// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentVisualizationInstance } from 'injected/frameCommunicators/html-element-axe-results-helper';
import { FeatureFlagStoreData } from '../../common/types/store-data/feature-flag-store-data';

export interface Drawer {
    initialize(config: DrawerInitData): void;
    isOverlayEnabled: boolean;
    drawLayout(): Promise<void>;
    eraseLayout(): void;
}

export interface DrawerInitData {
    data: AssessmentVisualizationInstance[] | null;
    featureFlagStoreData: FeatureFlagStoreData;
}
