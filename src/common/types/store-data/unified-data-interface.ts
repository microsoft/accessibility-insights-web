// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

// this is similar to `TestEngine` interface from axe-core
export interface ScanEngineProperties {
    name: string;
    version: string;
}

export interface OSProperties {
    name: string;
    version?: string;
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

export interface ScanResults {
    results: UnifiedResultInstance[];
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

export interface UnifiedResultInstance {
    id: string;
    status: ResultInstanceStatus;
    evaluation: StoredInstancePropertyBag;
    identifiers: StoredInstancePropertyBag;
    descriptors: StoredInstancePropertyBag;
    resolution: StoredInstancePropertyBag;
}

export type ResultInstanceStatus = 'pass' | 'fail' | 'unknown';
