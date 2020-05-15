// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ToolData } from './types/store-data/unified-data-interface';

export const createToolData = (
    toolName: string,
    toolVersion: string,
    scanEngineName: string,
    scanEngineVersion: string,
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
