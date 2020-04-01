// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { FileSystemConfiguration } from 'common/configuration/file-system-configuration';
import * as path from 'path';

describe('FileSystemConfiguration', () => {
    const configFileWithFullNameSet = path.join(__dirname, 'insights.config.test.json');
    const nonExistentConfigFile = path.join(__dirname, 'doesnt_exist.json');

    const fullNameFromConfigFile = 'Full Name In Config File';
    const defaultName = 'Accessibility Insights for Web';
    const newName = 'New Extension Name';

    it('reflects default values if the config file is not present', () => {
        const config = new FileSystemConfiguration(nonExistentConfigFile);
        expect(config.getOption('fullName')).toBe(defaultName);
        expect(config.config.options.fullName).toBe(defaultName);
    });

    it('reflects the properties on the config file', () => {
        const config = new FileSystemConfiguration(configFileWithFullNameSet);
        expect(config.getOption('fullName')).toBe(fullNameFromConfigFile);
        expect(config.config.options.fullName).toBe(fullNameFromConfigFile);
    });

    it('prefers explicitly set values to defaults', () => {
        const config = new FileSystemConfiguration(nonExistentConfigFile);
        config.setOption('fullName', newName);
        expect(config.getOption('fullName')).toBe(newName);
        expect(config.config.options.fullName).toBe(newName);
    });

    it('prefers explicitly set values to config file properties', () => {
        const config = new FileSystemConfiguration(configFileWithFullNameSet);
        config.setOption('fullName', newName);
        expect(config.getOption('fullName')).toBe(newName);
        expect(config.config.options.fullName).toBe(newName);
    });
});
