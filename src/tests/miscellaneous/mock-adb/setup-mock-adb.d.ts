// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
export const mockAdbFolder: string;

export type MockAdbConfig = {
    [inputCommand: string]: {
        stdout?: string;
        stderr?: string;
        exitCode?: number;
        startTestServer?: {
            port: number;
            path: string;
        };
        stopTestServer?: {
            port: number;
        };
    };
};

export async function setupMockAdb(config: MockAdbConfig): Promise<void>;

export type CommonAdbConfigName = 'single-device';
export const commonAdbConfigs: { [configName in CommonAdbConfigName]: MockAdbConfig };
