// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { GuidanceLink } from '../../../scanner/rule-to-links-mappings';

// this is similar to `TestEngine` interface from axe-core
export interface ScanEngineProperties {
    name: string;
    version: string;
}

export interface ApplicationProperties {
    name: string;
    version: string;
}

export interface OSProperties {
    name: string;
    version: string;
    userAgent?: string;
}

export interface ViewPortProperties {
    height?: number;
    width?: number;
}

export interface PlatformData {
    osInfo: OSProperties;
    viewPortInfo: ViewPortProperties;
}

export interface TargetAppData {
    name: string;
    url?: string;
}

export interface ToolData {
    scanEngineProperties: ScanEngineProperties;
    applicationProperties: ApplicationProperties;
}

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
}

export interface InstancePropertyBag {
    [property: string]: any;
}

export type StoredInstancePropertyBag = InstancePropertyBag;

export type UnifiedIdentifiers = {
    identifier?: string;
    conciseName?: string;
} & InstancePropertyBag;

export type UnifiedDescriptors = {
    snippet?: string;
} & InstancePropertyBag;

export type UnifiedResolution = {
    howToFixSummary?: string;
} & InstancePropertyBag;

export interface UnifiedResult {
    uid: string;
    status: InstanceResultStatus;
    ruleId: string;
    identifiers: UnifiedIdentifiers;
    descriptors: UnifiedDescriptors;
    resolution: UnifiedResolution;
}

export type InstanceResultStatus = 'pass' | 'fail' | 'unknown';

export type UnifiedRuleResultStatus = InstanceResultStatus | 'inapplicable';

export const AllRuleResultStatuses: UnifiedRuleResultStatus[] = ['pass', 'fail', 'unknown', 'inapplicable'];
