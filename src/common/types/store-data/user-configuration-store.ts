// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Rectangle } from 'electron';

// Licensed under the MIT License.
export interface UserConfigurationStoreData {
    isFirstTime: boolean;
    enableTelemetry: boolean;

    // Native/system high-contrast mode can cause high contrast to be enabled even if it was
    // not the last-selected option in our settings UI.
    enableHighContrast: boolean;
    lastSelectedHighContrast: boolean;

    bugService: string;
    bugServicePropertiesMap: IssueFilingServicePropertiesMap;

    // null if the path to adb is unknown
    adbLocation: string | null;

    windowWasMaximized: boolean;
    lastWindowBounds: Rectangle;
}

export interface IssueFilingServicePropertiesMap {
    [service: string]: IssueFilingServiceProperties;
}

export type IssueFilingServiceProperties = Object;

export interface WindowSize {
    width: number;
    height: number;
}
