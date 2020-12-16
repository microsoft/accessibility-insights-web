// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ToolData } from './types/store-data/unified-data-interface';

export const createToolData = (
    scanEngineName: string,
    scanEngineVersion: string,
    toolName: string,
    toolVersion?: string,
    environmentName?: string,
    resolution?: string,
): ToolData => {
    return {
        scanEngineProperties: {
            name: scanEngineName,
            version: scanEngineVersion,
        },
        applicationProperties: {
            name: toolName,
            version: toolVersion,
            environmentName: environmentName,
            resolution: resolution,
        },
    };
};
