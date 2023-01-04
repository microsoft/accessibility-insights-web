// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { TelemetryEventHandler } from 'background/telemetry/telemetry-event-handler';
import { TelemetryEventSource, TriggeredByNotApplicable } from 'common/extension-telemetry-events';
import {
    AndroidSetupStepTelemetryData,
    DEVICE_SETUP_STEP,
} from 'electron/common/electron-telemetry-events';
import { AndroidSetupStore } from 'electron/flux/store/android-setup-store';
import { AndroidSetupTelemetrySender } from 'electron/platform/android/android-setup-telemetry-sender';
import { AndroidSetupStepId } from 'electron/platform/android/setup/android-setup-step-id';
import { It, Mock, MockBehavior, Times } from 'typemoq';

describe('AndroidSetupTelemetrySender', () => {
    it('sends appropriate telemetry events when steps change', () => {
        testTelemetryEvents(
            ['detect-adb', 'detect-devices', 'detect-permissions'],
            [20, 400, 415],
            [
                {
                    prevStep: null,
                    newStep: 'detect-adb',
                    prevDuration: 0,
                },
                {
                    prevStep: 'detect-adb',
                    newStep: 'detect-devices',
                    prevDuration: 380,
                },
                {
                    prevStep: 'detect-devices',
                    newStep: 'detect-permissions',
                    prevDuration: 15,
                },
            ],
        );
    });

    it('does not send event if step has not changed', () => {
        testTelemetryEvents(
            ['detect-adb', 'detect-adb', 'detect-devices'],
            [20, 400, 450],
            [
                {
                    prevStep: null,
                    newStep: 'detect-adb',
                    prevDuration: 0,
                },
                {
                    prevStep: 'detect-adb',
                    newStep: 'detect-devices',
                    prevDuration: 430,
                },
            ],
        );
    });

    function testTelemetryEvents(
        steps: AndroidSetupStepId[],
        timestamps: number[],
        expectedEvents: Omit<AndroidSetupStepTelemetryData, 'triggeredBy' | 'source'>[],
    ): void {
        const getCurrentMsMock = Mock.ofInstance((): number => 0, MockBehavior.Strict);
        const telemetryEventHandlerMock = Mock.ofType(TelemetryEventHandler, MockBehavior.Strict);
        const androidSetupStoreMock = Mock.ofType(AndroidSetupStore, MockBehavior.Strict);
        const testListener = new AndroidSetupTelemetrySender(
            androidSetupStoreMock.object,
            telemetryEventHandlerMock.object,
            getCurrentMsMock.object,
        );

        steps.forEach(currentStepId =>
            androidSetupStoreMock
                .setup(m => m.getState())
                .returns(_ => ({ currentStepId }))
                .verifiable(Times.exactly(steps.length)),
        );
        timestamps.forEach(timestamp =>
            getCurrentMsMock
                .setup(m => m())
                .returns(_ => timestamp)
                .verifiable(Times.exactly(timestamps.length)),
        );
        expectedEvents.forEach(event =>
            telemetryEventHandlerMock.setup(m =>
                m.publishTelemetry(DEVICE_SETUP_STEP, {
                    telemetry: {
                        ...event,
                        triggeredBy: TriggeredByNotApplicable,
                        source: TelemetryEventSource.ElectronDeviceConnect,
                    },
                }),
            ),
        );

        let callback;
        androidSetupStoreMock
            .setup(m => m.addChangedListener(It.is(p => p instanceof Function)))
            .callback(cb => (callback = cb))
            .verifiable(Times.once());

        testListener.initialize();
        for (let i = 1; i <= steps.length - 1; i++) {
            callback(androidSetupStoreMock.object);
        }

        androidSetupStoreMock.verifyAll();
        getCurrentMsMock.verifyAll();
        telemetryEventHandlerMock.verifyAll();
    }
});
