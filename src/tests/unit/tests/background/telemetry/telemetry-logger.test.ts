// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IMock, Mock, Times } from 'typemoq';

import { FeatureFlagsController } from '../../../../../background/feature-flags-controller';
import { TelemetryBaseData } from '../../../../../background/telemetry/app-insights-telemetry-client';
import { TelemetryLogger } from '../../../../../background/telemetry/telemetry-logger';
import { FeatureFlags } from '../../../../../common/feature-flags';
import { Logger } from '../../../../../common/logging/logger';

describe('TelemetryLoggerTest', () => {
    let testObject: TelemetryLogger;
    let controllerMock: IMock<FeatureFlagsController>;
    let loggerMock: IMock<Logger>;

    beforeEach(() => {
        controllerMock = Mock.ofType(FeatureFlagsController);
        loggerMock = Mock.ofType<Logger>();
        testObject = new TelemetryLogger(loggerMock.object);
        testObject.initialize(controllerMock.object);
    });

    test('log (flag: enabled)', () => {
        const data: TelemetryBaseData = {
            name: 'test name',
            properties: {
                custom: 'custom value',
            },
        };

        controllerMock.setup(cm => cm.isEnabled(FeatureFlags.logTelemetryToConsole)).returns(() => true);
        loggerMock.setup(logger => logger.log('eventName: ', data.name, '; customProperties: ', data.properties)).verifiable(Times.once());

        testObject.log(data);

        loggerMock.verifyAll();
    });

    test('log (flag: disabled)', () => {
        const data: TelemetryBaseData = {
            name: 'test name',
            properties: {
                custom: 'custom value',
            },
        };

        controllerMock.setup(cm => cm.isEnabled(FeatureFlags.logTelemetryToConsole)).returns(() => false);

        testObject.log(data);
    });
});
