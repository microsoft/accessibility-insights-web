// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { TelemetryEventHandler } from 'background/telemetry/telemetry-event-handler';
import { TelemetryEventSource, TriggeredByNotApplicable } from 'common/extension-telemetry-events';
import { Action } from 'common/flux/action';
import { SCAN_COMPLETED, SCAN_FAILED, SCAN_STARTED } from 'electron/common/electron-telemetry-events';
import { ScanActionCreator } from 'electron/flux/action-creator/scan-action-creator';
import { ScanActions } from 'electron/flux/action/scan-actions';
import { FetchScanResultsType } from 'electron/platform/android/fetch-scan-results';
import { ScanResults } from 'electron/platform/android/scan-results';
import { tick } from 'tests/unit/common/tick';
import { IMock, It, Mock, Times } from 'typemoq';

describe('ScanActionCreator', () => {
    const port = 1111;

    const expectedScanStartedTelemetry = {
        telemetry: {
            port,
            source: TelemetryEventSource.ElectronDeviceConnect,
        },
    };

    let telemetryEventHandlerMock: IMock<TelemetryEventHandler>;
    let scanActionsMock: IMock<ScanActions>;
    let fetchScanResultsMock: IMock<FetchScanResultsType>;
    let scanStartedMock: IMock<Action<void>>;
    let scanCompletedMock: IMock<Action<void>>;
    let scanFailedMock: IMock<Action<void>>;

    let testSubject: ScanActionCreator;

    beforeEach(() => {
        telemetryEventHandlerMock = Mock.ofType<TelemetryEventHandler>();
        fetchScanResultsMock = Mock.ofType<FetchScanResultsType>();
        scanActionsMock = Mock.ofType<ScanActions>();

        scanStartedMock = Mock.ofType<Action<void>>();
        scanCompletedMock = Mock.ofType<Action<void>>();
        scanFailedMock = Mock.ofType<Action<void>>();

        scanActionsMock.setup(actions => actions.scanCompleted).returns(() => scanCompletedMock.object);
        scanActionsMock.setup(actions => actions.scanStarted).returns(() => scanStartedMock.object);
        scanActionsMock.setup(actions => actions.scanFailed).returns(() => scanFailedMock.object);

        testSubject = new ScanActionCreator(scanActionsMock.object, fetchScanResultsMock.object, telemetryEventHandlerMock.object);
    });

    it('scans successfully', async () => {
        const deviceName = 'test device';
        const appIdentifier = 'test app';

        fetchScanResultsMock.setup(fetch => fetch(port)).returns(() => Promise.resolve({ deviceName, appIdentifier } as ScanResults));

        testSubject.scan(port);

        await tick();

        telemetryEventHandlerMock.verify(
            handler => handler.publishTelemetry(SCAN_STARTED, It.isValue(expectedScanStartedTelemetry)),
            Times.once(),
        );

        telemetryEventHandlerMock.verify(
            handler =>
                handler.publishTelemetry(
                    SCAN_COMPLETED,
                    It.isValue({
                        telemetry: {
                            triggeredBy: TriggeredByNotApplicable,
                            source: TelemetryEventSource.ElectronDeviceConnect,
                        },
                    }),
                ),
            Times.once(),
        );

        scanStartedMock.verify(scanStarted => scanStarted.invoke(null), Times.once());
        scanCompletedMock.verify(scanCompleted => scanCompleted.invoke(null), Times.once());
    });

    it('scans and fail', async () => {
        fetchScanResultsMock.setup(fetch => fetch(port)).returns(() => Promise.reject());

        testSubject.scan(port);

        await tick();

        telemetryEventHandlerMock.verify(
            handler => handler.publishTelemetry(SCAN_STARTED, It.isValue(expectedScanStartedTelemetry)),
            Times.once(),
        );

        telemetryEventHandlerMock.verify(
            handler =>
                handler.publishTelemetry(
                    SCAN_FAILED,
                    It.isValue({
                        telemetry: {
                            triggeredBy: TriggeredByNotApplicable,
                            source: TelemetryEventSource.ElectronDeviceConnect,
                        },
                    }),
                ),
            Times.once(),
        );

        scanStartedMock.verify(scanStarted => scanStarted.invoke(null), Times.once());
        scanFailedMock.verify(scanCompleted => scanCompleted.invoke(null), Times.once());
    });
});
