// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import * as path from 'path';
import { cloneDeep } from 'lodash';
import {
    commonAdbConfigs,
    MockAdbConfig,
    simulateNoDevicesConnected,
    simulatePortForwardingError,
    simulateServiceInstallationError,
    simulateServiceLacksPermissions,
    simulateServiceNotInstalled,
    simulateInputKeyeventError,
} from 'tests/miscellaneous/mock-adb/setup-mock-adb';

describe('mock-adb tests match snapshots after normalizing path', () => {
    const definedConfigs = Object.getOwnPropertyNames(commonAdbConfigs);
    // This regex is used to replace the root of the local repo with '.'
    let basePathRegEx: RegExp;

    beforeAll(() => {
        const basePath = path.join(__dirname, '../../../../../../..');
        // We're matching JSON-escaped strings, so we need to escape our target
        // but remove the leading and trailing quotes
        const jsonBasePath = JSON.stringify(basePath);
        const regexTarget = jsonBasePath.substring(1, jsonBasePath.length - 1);
        basePathRegEx = new RegExp(regexTarget, 'g');
    });

    function removeRepoBase(input: string): string {
        return input.replace(basePathRegEx, '.');
    }

    function convertBackslashToForwardSlash(input: string): string {
        return input.replace(/\\/g, '/');
    }

    function standardizePath(input: string): string {
        return convertBackslashToForwardSlash(removeRepoBase(input));
    }

    function standardizeAllPaths(config: MockAdbConfig): MockAdbConfig {
        const startTestServer = 'startTestServer';
        const pathKey = 'path';
        const normalizedConfig: MockAdbConfig = {};

        Object.keys(config).forEach(key => {
            const newKey = standardizePath(key);
            const newItem = cloneDeep(config[key]);
            for (const field of ['stdout', 'stderr']) {
                if (newItem[field]) {
                    newItem[field] = standardizePath(newItem[field]);
                }
            }
            if (newItem[startTestServer] && newItem[startTestServer][pathKey]) {
                newItem[startTestServer][pathKey] = standardizePath(
                    newItem[startTestServer][pathKey],
                );
            }

            normalizedConfig[newKey] = newItem;
        });

        return normalizedConfig;
    }

    it.each(definedConfigs)("commonAdbConfigs['%s']", config => {
        const mockAdbConfig = commonAdbConfigs[config];
        expect(standardizeAllPaths(mockAdbConfig)).toMatchSnapshot();
    });

    it.each(definedConfigs)("simulateNoDevicesConnected(commonAdbConfigs['%s'])", config => {
        const mockAdbConfig = simulateNoDevicesConnected(commonAdbConfigs[config]);
        expect(standardizeAllPaths(mockAdbConfig)).toMatchSnapshot();
    });

    it.each(definedConfigs)("simulateServiceNotInstalled(commonAdbConfigs['%s'])", config => {
        const mockAdbConfig = simulateServiceNotInstalled(commonAdbConfigs[config]);
        expect(standardizeAllPaths(mockAdbConfig)).toMatchSnapshot();
    });

    it.each(definedConfigs)("simulateServiceLacksPermissions(commonAdbConfigs['%s'])", config => {
        const mockAdbConfig = simulateServiceLacksPermissions(commonAdbConfigs[config]);
        expect(standardizeAllPaths(mockAdbConfig)).toMatchSnapshot();
    });

    it.each(definedConfigs)("simulateServiceInstallationError(commonAdbConfigs['%s'])", config => {
        const mockAdbConfig = simulateServiceInstallationError(commonAdbConfigs[config]);
        expect(standardizeAllPaths(mockAdbConfig)).toMatchSnapshot();
    });

    it.each(definedConfigs)("simulatePortForwardingError(commonAdbConfigs['%s'])", config => {
        const mockAdbConfig = simulatePortForwardingError(commonAdbConfigs[config]);
        expect(standardizeAllPaths(mockAdbConfig)).toMatchSnapshot();
    });

    it.each(definedConfigs)("simulateInputKeyeventError(commonAdbConfigs['%s'])", config => {
        const mockAdbConfig = simulateInputKeyeventError(commonAdbConfigs[config]);
        expect(standardizeAllPaths(mockAdbConfig)).toMatchSnapshot();
    });
});
