// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { cloneDeep } from 'lodash';
import * as path from 'path';
import {
    commonAdbConfigs,
    MockAdbConfig,
    simulateNoDevicesConnected,
    simulatePortForwardingError,
    simulateServiceInstallationError,
    simulateServiceLacksPermissions,
    simulateServiceNotInstalled,
} from 'tests/miscellaneous/mock-adb/setup-mock-adb';

describe('mock-adb tests match snapshots after normalizing path', () => {
    const definedConfigs = ['single-device', 'multiple-devices', 'slow-single-device'];
    // This regex is used to replace the root of the local repo with '.'
    let basePathRegEx: RegExp;

    beforeAll(() => {
        const basePath = path.join(__dirname, '../../../../../../..');
        basePathRegEx = new RegExp(basePath.replace(/\\/g, '\\\\'), 'g');
    });

    function normalizePath(input: string): string {
        return input.replace(basePathRegEx, '.');
    }

    function normalizeAllPaths(config: MockAdbConfig): MockAdbConfig {
        const startTestServer = 'startTestServer';
        const pathKey = 'path';
        const normalizedConfig: MockAdbConfig = {};

        Object.keys(config).forEach(key => {
            const newKey = normalizePath(key);
            const newItem = cloneDeep(config[key]);
            for (const field of ['stdout', 'stderr']) {
                if (newItem[field]) {
                    newItem[field] = normalizePath(newItem[field]);
                }
            }
            if (newItem[startTestServer] && newItem[startTestServer][pathKey]) {
                newItem[startTestServer][pathKey] = normalizePath(
                    newItem[startTestServer][pathKey],
                );
            }

            normalizedConfig[newKey] = newItem;
        });

        return normalizedConfig;
    }

    it.each(definedConfigs)("commonAdbConfigs['%s']", config => {
        const mockAdbConfig = commonAdbConfigs[config];
        expect(normalizeAllPaths(mockAdbConfig)).toMatchSnapshot();
    });

    it.each(definedConfigs)("simulateNoDevicesConnected(commonAdbConfigs['%s'])", config => {
        const mockAdbConfig = simulateNoDevicesConnected(commonAdbConfigs[config]);
        expect(normalizeAllPaths(mockAdbConfig)).toMatchSnapshot();
    });

    it.each(definedConfigs)("simulateServiceNotInstalled(commonAdbConfigs['%s'])", config => {
        const mockAdbConfig = simulateServiceNotInstalled(commonAdbConfigs[config]);
        expect(normalizeAllPaths(mockAdbConfig)).toMatchSnapshot();
    });

    it.each(definedConfigs)("simulateServiceLacksPermissions(commonAdbConfigs['%s'])", config => {
        const mockAdbConfig = simulateServiceLacksPermissions(commonAdbConfigs[config]);
        expect(normalizeAllPaths(mockAdbConfig)).toMatchSnapshot();
    });

    it.each(definedConfigs)("simulateServiceInstallationError(commonAdbConfigs['%s'])", config => {
        const mockAdbConfig = simulateServiceInstallationError(commonAdbConfigs[config]);
        expect(normalizeAllPaths(mockAdbConfig)).toMatchSnapshot();
    });

    it.each(definedConfigs)("simulatePortForwardingError(commonAdbConfigs['%s'])", config => {
        const mockAdbConfig = simulatePortForwardingError(commonAdbConfigs[config]);
        expect(normalizeAllPaths(mockAdbConfig)).toMatchSnapshot();
    });
});
