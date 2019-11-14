// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { config, configMutator } from '../../../../../common/configuration';

describe('configuration', () => {
    beforeEach(() => configMutator.reset());
    afterAll(() => configMutator.reset());

    const defaultName = 'Accessibility Insights for Web';
    const newName = 'New Extension Name';

    test('fullName default', () => {
        expect(config.getOption('fullName')).toBe(defaultName);
        expect(config.config.options.fullName).toBe(defaultName);
    });

    test('telemetryBuildName default', () => {
        const defaultTelemetryBuildName = 'unknownBuild';

        expect(config.getOption('telemetryBuildName')).toBe(
            defaultTelemetryBuildName,
        );
        expect(config.config.options.telemetryBuildName).toBe(
            defaultTelemetryBuildName,
        );
    });

    test('fullName set', () => {
        configMutator.reset().setOption('fullName', newName);
        expect(config.getOption('fullName')).toBe(newName);
        expect(config.config.options.fullName).toBe(newName);
    });
});
