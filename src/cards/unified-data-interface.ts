// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
/**
 * The buckets that we might need for the unified data model
 *
 * rules
 * elements
 * results mapping the pas/fail, rules and elements
 * platform specific data
 * tool info. that is used for scanning
 * scan data
 */

// this is similar to `TestEngine` interface from axe-core
interface ScanEngine {
    name: string;
    version: string;
}

interface PlatformData {
    name: string;
    osVersion?: string;
    userAgent?: string;
    platformHeight?: number;
    platformWidth?: number;
    // mobile specific
    dpi?: number;
}

interface ToolData {
    scanEngine: ScanEngine;
}

interface ScanMetaData {}

interface ScanResults {
    rules: AxeRule;
    results: AxeResults;
    platformInfo: PlatformData;
    toolInfo: ToolData;
    scanMetaData: ScanMetaData;
}
