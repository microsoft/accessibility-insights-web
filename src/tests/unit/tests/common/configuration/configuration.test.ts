// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { config, configMutator } from '../../../../../common/configuration';

describe('configuration', () => {
    beforeEach(() => configMutator.reset());
    afterAll(() => configMutator.reset());

    const defaultName = 'Accessibility Insights for Web';
    const newName = 'New Extension Name';

    test('extensionFullName default', () => {
        expect(config.getOption('extensionFullName')).toBe(defaultName);
        expect(config.config.options.extensionFullName).toBe(defaultName);
    });

    test('telemetryBuildName default', () => {
        const defaultTelemetryBuildName = 'unknownBuild';

        expect(config.getOption('telemetryBuildName')).toBe(defaultTelemetryBuildName);
        expect(config.config.options.telemetryBuildName).toBe(defaultTelemetryBuildName);
    });

    test('extensionFullName set', () => {
        configMutator.reset().setOption('extensionFullName', newName);
        expect(config.getOption('extensionFullName')).toBe(newName);
        expect(config.config.options.extensionFullName).toBe(newName);
    });
});
