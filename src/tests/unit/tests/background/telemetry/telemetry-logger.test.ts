// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { GlobalMock, GlobalScope, IMock, It, Mock, MockBehavior, Times } from 'typemoq';

import { FeatureFlagsController } from '../../../../../background/feature-flags-controller';
import { TelemetryBaseData } from '../../../../../background/telemetry/app-insights-telemetry-client';
import { TelemetryLogger } from '../../../../../background/telemetry/telemetry-logger';
import { FeatureFlags } from '../../../../../common/feature-flags';

describe('TelemetryLoggerTest', () => {
    let testObject: TelemetryLogger;
    let controllerMock: IMock<FeatureFlagsController>;
    beforeEach(() => {
        controllerMock = Mock.ofType(FeatureFlagsController);
        testObject = new TelemetryLogger();
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

        const consoleLogMock = GlobalMock.ofInstance(console.log, 'log', console, MockBehavior.Strict);
        consoleLogMock.setup(log => log('eventName: ', data.name, '; customProperties: ', data.properties)).verifiable(Times.once());

        GlobalScope.using(consoleLogMock).with(() => {
            testObject.log(data);
        });

        consoleLogMock.verifyAll();
    });

    test('log (flag: disabled)', () => {
        controllerMock.setup(cm => cm.isEnabled(FeatureFlags.logTelemetryToConsole)).returns(() => false);

        const data: TelemetryBaseData = {
            name: 'test name',
            properties: {
                custom: 'custom value',
            },
        };

        const consoleLogMock = GlobalMock.ofInstance(console.log, 'log', console, MockBehavior.Strict);
        consoleLogMock.setup(log => log(It.isAny())).verifiable(Times.never());

        GlobalScope.using(consoleLogMock).with(() => {
            testObject.log(data);
        });

        consoleLogMock.verifyAll();
    });
});
