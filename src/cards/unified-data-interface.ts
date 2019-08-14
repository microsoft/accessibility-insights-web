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
    results: UnifiedAxeResults;
    platformInfo: PlatformData;
    toolInfo: ToolData;
    scanMetaData: ScanMetaData;
}

interface UnifiedRule {
    id: string;
    nodes: UnifiedAxeResults[];
    ruleDescription: string;
}

// interfaces below this mark is going to be related to ResultInstance work that is still in progress

interface UnifiedAxeResults {
    passes: ResultInstance[];
    violations: ResultInstance[];
    incomplete: ResultInstance[];
}

interface ResultInstance {}

interface ScannedElementInfo {}
