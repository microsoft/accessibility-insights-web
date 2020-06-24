// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BaseActionPayload } from 'background/actions/action-payloads';
import { TelemetryEventHandler } from 'background/telemetry/telemetry-event-handler';
import { TelemetryEventSource, TriggeredByNotApplicable } from 'common/types/telemetry-data';
import { APP_INITIALIZED } from 'electron/common/electron-telemetry-events';
import { sendAppInitializedTelemetryEvent } from 'electron/views/device-connect-view/send-app-initialized-telemetry';
import { PlatformInfo } from 'electron/window-management/platform-info';
import { IMock, It, Mock, Times } from 'typemoq';

describe('sendAppInitializedTelemetry', () => {
    let telemetryEventHandlerMock: IMock<TelemetryEventHandler>;
    let platformInfoMock: IMock<PlatformInfo>;
    const testSubject = sendAppInitializedTelemetryEvent;

    beforeEach(() => {
        telemetryEventHandlerMock = Mock.ofType<TelemetryEventHandler>();
        platformInfoMock = Mock.ofType<PlatformInfo>();
    });

    it('send telemetry', () => {
        platformInfoMock.setup(x => x.getOsName()).returns(() => 'osName');
        testSubject(telemetryEventHandlerMock.object, platformInfoMock.object);

        const expectedTelemetry: BaseActionPayload = {
            telemetry: {
                source: TelemetryEventSource.ElectronDeviceConnect,
                triggeredBy: TriggeredByNotApplicable,
                os: 'osName',
            },
        };

        telemetryEventHandlerMock.verify(
            handler => handler.publishTelemetry(APP_INITIALIZED, It.isValue(expectedTelemetry)),
            Times.once(),
        );
    });
});
