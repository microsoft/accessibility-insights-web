// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ApplicationBuildGenerator } from 'background/application-build-generator';
import { configMutator } from '../../../../common/configuration';

describe('ApplicationBuildGeneratorTest', () => {
    let testSubject: ApplicationBuildGenerator;

    beforeEach(() => {
        testSubject = new ApplicationBuildGenerator();
    });

    test('test for getBuild variants', () => {
        const telemetryBuildName = 'telemetry-build-name';
        configMutator.setOption('telemetryBuildName', telemetryBuildName);
        expect(testSubject.getBuild()).toBe(telemetryBuildName);
    });
});
