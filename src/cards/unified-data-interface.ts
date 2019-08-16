// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

// this is similar to `TestEngine` interface from axe-core
interface ScanEngine {
    name: string;
    version: string;
}

interface OSData {
    name: string;
    osVersion?: string;
    userAgent?: string;
}

interface ViewPortData {
    platformHeight?: number;
    platformWidth?: number;
}

interface PlatformData {
    osInfo: OSData;
    viewPortInfo: ViewPortData;
}

interface ToolData {
    scanEngine: ScanEngine;
}

interface ScanMetaData {}

interface ScanResults {
    results: UnifiedResults;
    platformInfo: PlatformData;
    toolInfo: ToolData;
    scanMetaData: ScanMetaData;
}

interface UnifiedResults {
    passes: UnifiedResultInstance[];
    violations: UnifiedResultInstance[];
    incomplete: UnifiedResultInstance[];
}

interface UnifiedRuleResult {
    id: string;
    ruleDescription: string;
}

interface InstancePropertyBag<T> {
    [property: string]: T;
}

type StoredInstancePropertyBag = InstancePropertyBag<any>;

interface UnifiedResultInstance {
    id: string;
    evaluation: StoredInstancePropertyBag;
    identifiers: StoredInstancePropertyBag;
    descriptors: StoredInstancePropertyBag;
    resolution: StoredInstancePropertyBag;
}
