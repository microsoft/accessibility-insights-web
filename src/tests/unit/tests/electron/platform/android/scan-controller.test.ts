// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { TelemetryEventHandler } from 'background/telemetry/telemetry-event-handler';
import { TelemetryEventSource } from 'common/extension-telemetry-events';
import { Action } from 'common/flux/action';
import { Logger } from 'common/logging/logger';
import { SCAN_COMPLETED, SCAN_FAILED, SCAN_STARTED } from 'electron/common/electron-telemetry-events';
import { PortPayload } from 'electron/flux/action/device-action-payloads';
import { ScanActions } from 'electron/flux/action/scan-actions';
import { FetchScanResultsType } from 'electron/platform/android/fetch-scan-results';
import { ScanController } from 'electron/platform/android/scan-controller';
import { ScanResults } from 'electron/platform/android/scan-results';
import { isFunction } from 'lodash';
import { tick } from 'tests/unit/common/tick';
import { axeRuleResultExample } from 'tests/unit/tests/electron/flux/action-creator/scan-result-example';
import { ExpectedCallType, IMock, It, Mock, Times } from 'typemoq';

describe('ScanController', () => {
    const port = 1111;

    const payload: PortPayload = {
        port,
    };

    const expectedScanStartedTelemetry = {
        telemetry: {
            port,
            source: TelemetryEventSource.ElectronDeviceConnect,
        },
    };

    let telemetryEventHandlerMock: IMock<TelemetryEventHandler>;
    let scanActionsMock: IMock<ScanActions>;
    let fetchScanResultsMock: IMock<FetchScanResultsType>;
    let scanStartedMock: IMock<Action<PortPayload>>;
    let scanCompletedMock: IMock<Action<void>>;
    let scanFailedMock: IMock<Action<void>>;
    let getCurrentDateMock: IMock<() => Date>;
    let loggerMock: IMock<Logger>;

    let testSubject: ScanController;

    beforeEach(() => {
        telemetryEventHandlerMock = Mock.ofType<TelemetryEventHandler>();
        fetchScanResultsMock = Mock.ofType<FetchScanResultsType>();
        scanActionsMock = Mock.ofType<ScanActions>();

        scanStartedMock = Mock.ofType<Action<PortPayload>>();
        scanStartedMock.setup(scanStarted => scanStarted.addListener(It.is(isFunction))).callback(listener => listener(payload));

        scanCompletedMock = Mock.ofType<Action<void>>();
        scanFailedMock = Mock.ofType<Action<void>>();

        scanActionsMock.setup(actions => actions.scanCompleted).returns(() => scanCompletedMock.object);
        scanActionsMock.setup(actions => actions.scanStarted).returns(() => scanStartedMock.object);
        scanActionsMock.setup(actions => actions.scanFailed).returns(() => scanFailedMock.object);

        getCurrentDateMock = Mock.ofType<() => Date>();
        getCurrentDateMock.setup(getter => getter()).returns(() => new Date(2019, 10, 8, 9, 0, 0));
        getCurrentDateMock.setup(getter => getter()).returns(() => new Date(2019, 10, 8, 9, 2, 15));

        loggerMock = Mock.ofType<Logger>();

        testSubject = new ScanController(
            scanActionsMock.object,
            fetchScanResultsMock.object,
            telemetryEventHandlerMock.object,
            getCurrentDateMock.object,
            loggerMock.object,
        );
    });

    it('scans and handle successful response', async () => {
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

        testSubject.initialize();

        await tick();

        scanCompletedMock.verify(scanCompleted => scanCompleted.invoke(null), Times.once());

        telemetryEventHandlerMock.verifyAll();
    });

    it('scans and handle error ', async () => {
        const errorReason = 'dummy reason';
        fetchScanResultsMock.setup(fetch => fetch(port)).returns(() => Promise.reject(errorReason));

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

        testSubject.initialize();

        await tick();

        scanFailedMock.verify(scanCompleted => scanCompleted.invoke(null), Times.once());
        loggerMock.verify(logger => logger.error('scan failed: ', errorReason), Times.once());

        telemetryEventHandlerMock.verifyAll();
    });
});
