// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { NullTelemetryClient } from 'background/telemetry/null-telemetry-client';
import { TelemetryBaseData } from 'background/telemetry/telemetry-base-data';
import { TelemetryLogger } from 'background/telemetry/telemetry-logger';
import { IMock, Mock, Times } from 'typemoq';
import { ApplicationTelemetryDataFactory } from '../../../../../background/telemetry/application-telemetry-data-factory';

describe('Null telemetry client', () => {
    let loggerMock: IMock<TelemetryLogger>;
    let telemetryDataFactoryMock: IMock<ApplicationTelemetryDataFactory>;

    beforeEach(() => {
        loggerMock = Mock.ofType<TelemetryLogger>();
        telemetryDataFactoryMock = Mock.ofType<ApplicationTelemetryDataFactory>();
    });

    describe('no op, no side effects', () => {
        const data = [
            ['constructor', createDefaultTestObject],
            ['enableTelemetry', () => createDefaultTestObject().enableTelemetry()],
            ['disableTelemetry', () => createDefaultTestObject().disableTelemetry()],
        ];

        it.each(data)('%s', (_, toExec) => {
            expect(toExec).not.toThrow();
        });
    });

    describe('trackEvent', () => {
        it('should log telemetry', () => {
            const name = 'test-event-name';
            const properties = {};

            const expected: TelemetryBaseData = {
                name,
                properties,
            };

            loggerMock.setup(logger => logger.log(expected)).verifiable(Times.once());

            const testObject = createDefaultTestObject();

            testObject.trackEvent(name, properties);

            loggerMock.verifyAll();
        });
    });

    function createDefaultTestObject(): NullTelemetryClient {
        return new NullTelemetryClient(telemetryDataFactoryMock.object, loggerMock.object);
    }
});
