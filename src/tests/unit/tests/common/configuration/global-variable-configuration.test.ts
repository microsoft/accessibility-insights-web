// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { GlobalVariableConfiguration } from 'common/configuration/global-variable-configuration';

describe('GlobalVariableConfiguration', () => {
    const config = new GlobalVariableConfiguration();

    beforeEach(() => config.reset());
    afterAll(() => config.reset());

    const defaultTelemetryBuildName = 'unknownBuild';
    const defaultName = 'Accessibility Insights for Web';
    const newName = 'New Extension Name';

    it('reflects the expected default values if none have been set (fullName)', () => {
        expect(config.getOption('fullName')).toBe(defaultName);
        expect(config.config.options.fullName).toBe(defaultName);
    });

    it('reflects the expected default values if none have been set (telemetryBuildName)', () => {
        expect(config.getOption('telemetryBuildName')).toBe(defaultTelemetryBuildName);
        expect(config.config.options.telemetryBuildName).toBe(defaultTelemetryBuildName);
    });

    it('reflects values that have been set explicitly', () => {
        config.setOption('fullName', newName);
        expect(config.getOption('fullName')).toBe(newName);
        expect(config.config.options.fullName).toBe(newName);
    });

    it('reflects the properties on the window variable', () => {
        window['insights'] = { options: { fullName: newName } };
        expect(config.getOption('fullName')).toBe(newName);
        expect(config.config.options.fullName).toBe(newName);
    });

    it('prefers explicitly set values to window properties', () => {
        window['insights'] = { options: { fullName: 'name from window property' } };
        config.setOption('fullName', newName);
        expect(config.getOption('fullName')).toBe(newName);
        expect(config.config.options.fullName).toBe(newName);
    });
});
