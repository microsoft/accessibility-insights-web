// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

// this is similar to `TestEngine` interface from axe-core
export interface ScanEngineProperties {
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

export interface ToolData {
    scanEngineProperties: ScanEngineProperties;
}

export interface UnifiedResults {
    results: UnifiedResult[];
    platformInfo?: PlatformData;
    toolInfo?: ToolData;
}

export interface UnifiedRule {
    id: string;
    description: string;
}

export interface InstancePropertyBag {
    [property: string]: any;
}

export type StoredInstancePropertyBag = InstancePropertyBag;

export interface UnifiedResult {
    uid: string;
    status: ResultStatus;
    ruleId: string;
    identifiers: StoredInstancePropertyBag;
    descriptors: StoredInstancePropertyBag;
    resolution: StoredInstancePropertyBag;
}

export type ResultStatus = 'pass' | 'fail' | 'unknown';
