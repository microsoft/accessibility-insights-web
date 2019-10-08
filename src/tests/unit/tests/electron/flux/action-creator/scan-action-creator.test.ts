// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { TelemetryEventHandler } from 'background/telemetry/telemetry-event-handler';
import { TelemetryEventSource } from 'common/extension-telemetry-events';
import { Action } from 'common/flux/action';
import { SCAN_COMPLETED, SCAN_FAILED, SCAN_STARTED } from 'electron/common/electron-telemetry-events';
import { ScanActionCreator } from 'electron/flux/action-creator/scan-action-creator';
import { ScanActions } from 'electron/flux/action/scan-actions';
import { FetchScanResultsType } from 'electron/platform/android/fetch-scan-results';
import { ScanResults } from 'electron/platform/android/scan-results';
import { tick } from 'tests/unit/common/tick';
import { ExpectedCallType, IMock, It, Mock, Times } from 'typemoq';
import { axeRuleResultExample } from './scan-result-example';

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
    let getCurrentDateMock: IMock<() => Date>;

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

        getCurrentDateMock = Mock.ofType<() => Date>();
        getCurrentDateMock.setup(getter => getter()).returns(() => new Date(2019, 10, 8, 9, 0, 0));
        getCurrentDateMock.setup(getter => getter()).returns(() => new Date(2019, 10, 8, 9, 2, 15));

        testSubject = new ScanActionCreator(
            scanActionsMock.object,
            fetchScanResultsMock.object,
            telemetryEventHandlerMock.object,
            getCurrentDateMock.object,
        );
    });

    it('scans successfully', async () => {
        fetchScanResultsMock.setup(fetch => fetch(port)).returns(() => Promise.resolve(new ScanResults(axeRuleResultExample)));

        telemetryEventHandlerMock
            .setup(handler => handler.publishTelemetry(SCAN_STARTED, It.isValue(expectedScanStartedTelemetry)))
            .verifiable(Times.once(), ExpectedCallType.InSequence);

        telemetryEventHandlerMock
            .setup(handler =>
                handler.publishTelemetry(
                    SCAN_COMPLETED,
                    It.isValue({
                        telemetry: {
                            port,
                            scanDuration: 135000,
                            PASS: {
                                ImageViewName: 2,
                                ColorContrast: 2,
                                ActiveViewName: 1,
                                EditTextValue: 1,
                                DontMoveAccessibilityFocus: 1,
                            },
                            FAIL: { TouchSizeWcag: 1, EditTextName: 1, ColorContrast: 1 },
                            INCOMPLETE: { ColorContrast: 1 },
                        },
                    }),
                ),
            )
            .verifiable(Times.once(), ExpectedCallType.InSequence);

        testSubject.scan(port);

        await tick();

        scanStartedMock.verify(scanStarted => scanStarted.invoke(null), Times.once());
        scanCompletedMock.verify(scanCompleted => scanCompleted.invoke(null), Times.once());

        telemetryEventHandlerMock.verifyAll();
    });

    it('scans and fail', async () => {
        fetchScanResultsMock.setup(fetch => fetch(port)).returns(() => Promise.reject());

        telemetryEventHandlerMock
            .setup(handler => handler.publishTelemetry(SCAN_STARTED, It.isValue(expectedScanStartedTelemetry)))
            .verifiable(Times.once(), ExpectedCallType.InSequence);

        telemetryEventHandlerMock
            .setup(handler =>
                handler.publishTelemetry(
                    SCAN_FAILED,
                    It.isValue({
                        telemetry: {
                            port,
                            scanDuration: 135000,
                        },
                    }),
                ),
            )
            .verifiable(Times.once(), ExpectedCallType.InSequence);

        testSubject.scan(port);

        await tick();

        scanStartedMock.verify(scanStarted => scanStarted.invoke(null), Times.once());
        scanFailedMock.verify(scanCompleted => scanCompleted.invoke(null), Times.once());

        telemetryEventHandlerMock.verifyAll();
    });
});
