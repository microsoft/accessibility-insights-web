// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

// this is similar to `TestEngine` interface from axe-core
export interface ScanEngine {
    name: string;
    version: string;
}

export interface OSData {
    name: string;
    version?: string;
    userAgent?: string;
}

export interface ViewPortData {
    height?: number;
    width?: number;
}

export interface PlatformData {
    osInfo: OSData;
    viewPortInfo: ViewPortData;
}

export interface ToolData {
    scanEngine: ScanEngine;
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
    evaluation: StoredInstancePropertyBag;
    identifiers: StoredInstancePropertyBag;
    descriptors: StoredInstancePropertyBag;
    resolution: StoredInstancePropertyBag;
}

export type ResultInstanceStatus = 'pass' | 'fail' | 'unknown';
