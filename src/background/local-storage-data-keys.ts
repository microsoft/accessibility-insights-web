// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
export class LocalStorageDataKeys {
    public static readonly url: string = 'url';
    public static readonly featureFlags: string = 'featureFlags';
    public static readonly alias: string = 'alias';
    public static readonly hideStartDialog: string = 'hideStartDialog';
    public static readonly launchPanelSetting: string = 'launchPanelSetting';
    public static readonly installationData: string = 'installationData';
}

export const storageDataKeys: string[] = [
    LocalStorageDataKeys.url,
    LocalStorageDataKeys.featureFlags,
    LocalStorageDataKeys.launchPanelSetting,
    LocalStorageDataKeys.installationData,
];

export const deprecatedStorageDataKeys: string[] = [
    LocalStorageDataKeys.alias,
    LocalStorageDataKeys.hideStartDialog,
];
