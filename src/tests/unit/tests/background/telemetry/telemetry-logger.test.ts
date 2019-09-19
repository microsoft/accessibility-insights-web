// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { TelemetryBaseData } from 'background/telemetry/telemetry-base-data';
import { TelemetryLogger } from 'background/telemetry/telemetry-logger';
import { IMock, It, Mock, Times } from 'typemoq';
import { FeatureFlagChecker } from '../../../../../background/feature-flag-checker';
import { FeatureFlags } from '../../../../../common/feature-flags';
import { Logger } from '../../../../../common/logging/logger';

describe('TelemetryLoggerTest', () => {
    let testObject: TelemetryLogger;
    let controllerMock: IMock<FeatureFlagChecker>;
    let loggerMock: IMock<Logger>;

    const testTelemetryData: TelemetryBaseData = {
        name: 'test name',
        properties: {
            custom: 'custom value',
        },
    };

    beforeEach(() => {
        controllerMock = Mock.ofType<FeatureFlagChecker>();
        loggerMock = Mock.ofType<Logger>();
        testObject = new TelemetryLogger(loggerMock.object);
        testObject.initialize(controllerMock.object);
    });

    it('logs telemetry (flag: enabled)', () => {
        controllerMock.setup(cm => cm.isEnabled(FeatureFlags.logTelemetryToConsole)).returns(() => true);

        testObject.log(testTelemetryData);

        loggerMock.verify(
            logger => logger.log('eventName: ', testTelemetryData.name, '; customProperties: ', testTelemetryData.properties),
            Times.once(),
        );
    });

    it('logs telemetry (flag: disabled)', () => {
        controllerMock.setup(cm => cm.isEnabled(FeatureFlags.logTelemetryToConsole)).returns(() => false);

        testObject.log(testTelemetryData);

        loggerMock.verify(logger => logger.log(It.isAny()), Times.never());
    });
});
