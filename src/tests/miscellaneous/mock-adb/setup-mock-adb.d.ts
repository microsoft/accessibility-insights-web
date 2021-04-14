// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
export const mockAdbFolder: string;

export type MockAdbConfig = {
    [inputCommand: string]: {
        regexTarget?: string;
        stdout?: string;
        stderr?: string;
        exitCode?: number;
        delayMs?: number;
        startTestServer?: {
            port: number;
            path: string;
        };
        stopTestServer?: {
            port: number;
        };
    };
};

export async function setupMockAdb(
    config: MockAdbConfig,
    logFolderName: string,
    ...extraLogNames: string[]
): Promise<void>;

export type CommonAdbConfigName = 'single-device';
export const commonAdbConfigs: { [configName in CommonAdbConfigName]: MockAdbConfig };
export function simulateNoDevicesConnected(config: MockAdbConfig): MockAdbConfig;
export function simulatePortForwardingError(config: MockAdbConfig): MockAdbConfig;
export function simulateServiceLacksPermissions(config: MockAdbConfig): MockAdbConfig;
export function simulateServiceNotInstalled(config: MockAdbConfig): MockAdbConfig;
export function simulateServiceInstallationError(config: MockAdbConfig): MockAdbConfig;
export function simulateInputKeyeventError(config: MockAdbConfig): MockAdbConfig;
export function delayAllCommands(delayMs: number, config: MockAdbConfig): MockAdbConfig;
export const emulatorDeviceName: string;
export const physicalDeviceName1: string;
export const physicalDeviceName2: string;
