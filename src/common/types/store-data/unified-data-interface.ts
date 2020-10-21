// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BoundingRectangle } from 'electron/platform/android/android-scan-results';
import { GuidanceLink } from '../../../scanner/rule-to-links-mappings';
import { ScanIncompleteWarningId } from '../scan-incomplete-warnings';

// this is similar to `TestEngine` interface from axe-core
export interface ScanEngineProperties {
    name: string;
    version: string;
}

export interface ApplicationProperties {
    name: string;
    version?: string;
    environmentName?: string;
}

export interface OSProperties {
    name: string;
    version?: string;
    userAgent?: string;
}

export interface ViewPortProperties {
    height?: number;
    width?: number;
    dpi?: number;
}

export interface PlatformData {
    osInfo: OSProperties;
    viewPortInfo: ViewPortProperties;
    deviceName?: string;
}

export interface TargetAppData {
    name: string;
    url?: string;
}

export interface ToolData {
    scanEngineProperties: ScanEngineProperties;
    applicationProperties: ApplicationProperties;
}

export type ScanTimespan = {
    scanComplete: Date;
    scanStart?: Date;
    durationSeconds?: number;
};

export type ScanMetadata = {
    timespan: ScanTimespan;
    toolData: ToolData;
    targetAppInfo: TargetAppData;
    deviceName?: string;
};

export interface UnifiedRule {
    id: string;
    description: string;
    url: string;
    guidance: GuidanceLink[];
}

export interface UnifiedScanResultStoreData {
    results: UnifiedResult[];
    rules: UnifiedRule[];
    platformInfo?: PlatformData;
    toolInfo?: ToolData;
    targetAppInfo?: TargetAppData;
    timestamp?: string;
    scanIncompleteWarnings?: ScanIncompleteWarningId[];
    screenshotData?: ScreenshotData;
}

export interface InstancePropertyBag {
    [property: string]: any;
}

export type StoredInstancePropertyBag = InstancePropertyBag;

export type UnifiedIdentifiers = {
    identifier: string;
    conciseName: string;
} & InstancePropertyBag;

export type UnifiedDescriptors = {
    snippet?: string;
    boundingRectangle?: BoundingRectangle;
} & InstancePropertyBag;

export type UnifiedResolution = {
    howToFixSummary: string;
} & InstancePropertyBag;

export type FormattableResolution = {
    howToFix: string;
    formatAsCode?: string[];
};

export type UnifiedFormattableResolution = {
    howToFixFormat?: FormattableResolution;
} & UnifiedResolution;

export interface UnifiedResult {
    uid: string;
    status: InstanceResultStatus;
    ruleId: string;
    identifiers: UnifiedIdentifiers;
    descriptors: UnifiedDescriptors;
    resolution: UnifiedResolution;
}

export type InstanceResultStatus = 'pass' | 'fail' | 'unknown';

export interface ScreenshotData {
    base64PngData: string;
}
