// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { TelemetryEventHandler } from 'background/telemetry/telemetry-event-handler';
import { sendAppInitializedTelemetryEvent } from 'electron/common/send-app-initialized-telemetry-sender';
import { IMock, It, Mock, Times } from 'typemoq';

import { BaseActionPayload } from '../../../../../background/actions/action-payloads';
import { TelemetryEventSource, TriggeredByNotApplicable } from '../../../../../common/extension-telemetry-events';
import { UserConfigurationStoreData } from '../../../../../common/types/store-data/user-configuration-store';
import { APP_INITIALIZED } from '../../../../../electron/common/electron-telemetry-events';

describe('sendAppInitializedTelemetrySender', () => {
    let telemetryEventHandlerMock: IMock<TelemetryEventHandler>;

    const testSubject = sendAppInitializedTelemetryEvent;

    beforeEach(() => {
        telemetryEventHandlerMock = Mock.ofType<TelemetryEventHandler>();
    });

    it('send telemetry if it is not the first time', () => {
        const userData = { isFirstTime: false } as UserConfigurationStoreData;

        testSubject(userData, telemetryEventHandlerMock.object);

        const expectedTelemetry: BaseActionPayload = {
            telemetry: {
                source: TelemetryEventSource.ElectronDeviceConnect,
                triggeredBy: TriggeredByNotApplicable,
            },
        };

        telemetryEventHandlerMock.verify(handler => handler.publishTelemetry(APP_INITIALIZED, It.isValue(expectedTelemetry)), Times.once());
    });

    it('does not send telemetry if it is the first time', () => {
        const userData = { isFirstTime: true } as UserConfigurationStoreData;

        testSubject(userData, telemetryEventHandlerMock.object);

        telemetryEventHandlerMock.verify(handler => handler.publishTelemetry(APP_INITIALIZED, It.isAny()), Times.never());
    });
});
