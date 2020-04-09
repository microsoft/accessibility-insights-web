// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ToolData } from './types/store-data/unified-data-interface';

export const createToolData = (
    toolVersion: string,
    scanEngineVersion: string,
    scanEngineName: string,
    toolName?: string,
    environmentName?: string,
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
        },
    };
};
