// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
export enum LaunchPanelType {
    AdhocToolsPanel,
    LaunchPad,
}
export interface LaunchPanelStoreData {
    launchPanelType: LaunchPanelType;
}
