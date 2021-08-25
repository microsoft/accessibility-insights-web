// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { UnifiedScanCompletedPayload } from 'background/actions/action-payloads';
import { UnifiedScanResultActions } from 'background/actions/unified-scan-result-actions';
import { TelemetryEventHandler } from 'background/telemetry/telemetry-event-handler';
import { TelemetryEventSource } from 'common/extension-telemetry-events';
import { Action } from 'common/flux/action';
import { Logger } from 'common/logging/logger';
import { ScanIncompleteWarningId } from 'common/types/scan-incomplete-warnings';
import {
    SCAN_COMPLETED,
    SCAN_FAILED,
    SCAN_STARTED,
} from 'electron/common/electron-telemetry-events';
import { DeviceConnectionActions } from 'electron/flux/action/device-connection-actions';
import { ScanActions } from 'electron/flux/action/scan-actions';
import { AndroidScanResults } from 'electron/platform/android/android-scan-results';
import { DeviceCommunicator } from 'electron/platform/android/device-communicator';
import { ScanController } from 'electron/platform/android/scan-controller';
import { UnifiedScanCompletedPayloadBuilder } from 'electron/platform/android/unified-result-builder';
import { isFunction } from 'lodash';
import { tick } from 'tests/unit/common/tick';
import { scanResultV2Example } from 'tests/unit/tests/electron/flux/action-creator/scan-result-example';
import { ExpectedCallType, IMock, It, Mock, MockBehavior, Times } from 'typemoq';

describe('ScanController', () => {
    const expectedScanStartedTelemetry = {
        telemetry: {
            source: TelemetryEventSource.ElectronDeviceConnect,
        },
    };

    let deviceCommunicatorMock: IMock<DeviceCommunicator>;
    let telemetryEventHandlerMock: IMock<TelemetryEventHandler>;
    let getCurrentDateMock: IMock<() => Date>;
    let loggerMock: IMock<Logger>;

    let scanActionsMock: IMock<ScanActions>;
    let scanStartedMock: IMock<Action<void>>;
    let scanCompletedMock: IMock<Action<void>>;
    let scanFailedMock: IMock<Action<void>>;

    let deviceConnectionActionsMock: IMock<DeviceConnectionActions>;
    let deviceConnectedMock: IMock<Action<void>>;
    let deviceDisconnectedMock: IMock<Action<void>>;

    let unifiedScanResultActionsMock: IMock<UnifiedScanResultActions>;
    let unifiedResultsBuilderMock: IMock<UnifiedScanCompletedPayloadBuilder>;

    let testSubject: ScanController;

    beforeEach(() => {
        telemetryEventHandlerMock = Mock.ofType<TelemetryEventHandler>();
        deviceCommunicatorMock = Mock.ofType<DeviceCommunicator>();
        scanActionsMock = Mock.ofType<ScanActions>();

        scanStartedMock = Mock.ofType<Action<void>>();
        scanStartedMock
            .setup(scanStarted => scanStarted.addListener(It.is(isFunction)))
            .callback(listener => listener());
        scanCompletedMock = Mock.ofType<Action<void>>();
        scanFailedMock = Mock.ofType<Action<void>>();

        deviceConnectedMock = Mock.ofType<Action<void>>();
        deviceDisconnectedMock = Mock.ofType<Action<void>>();
        deviceConnectionActionsMock = Mock.ofType<DeviceConnectionActions>();
        deviceConnectionActionsMock
            .setup(actions => actions.statusConnected)
            .returns(() => deviceConnectedMock.object);
        deviceConnectionActionsMock
            .setup(actions => actions.statusDisconnected)
            .returns(() => deviceDisconnectedMock.object);

        scanActionsMock
            .setup(actions => actions.scanCompleted)
            .returns(() => scanCompletedMock.object);
        scanActionsMock.setup(actions => actions.scanStarted).returns(() => scanStartedMock.object);
        scanActionsMock.setup(actions => actions.scanFailed).returns(() => scanFailedMock.object);

        getCurrentDateMock = Mock.ofType<() => Date>(undefined, MockBehavior.Strict);
        getCurrentDateMock.setup(getter => getter()).returns(() => new Date(2019, 10, 8, 9, 0, 0));
        getCurrentDateMock.setup(getter => getter()).returns(() => new Date(2019, 10, 8, 9, 2, 15));

        unifiedScanResultActionsMock = Mock.ofType<UnifiedScanResultActions>();
        unifiedResultsBuilderMock = Mock.ofType<UnifiedScanCompletedPayloadBuilder>(
            undefined,
            MockBehavior.Strict,
        );

        loggerMock = Mock.ofType<Logger>();

        testSubject = new ScanController(
            scanActionsMock.object,
            unifiedScanResultActionsMock.object,
            deviceConnectionActionsMock.object,
            unifiedResultsBuilderMock.object,
            telemetryEventHandlerMock.object,
            getCurrentDateMock.object,
            loggerMock.object,
            deviceCommunicatorMock.object,
        );
    });

    it('scans and handles successful v2 response', async () => {
        const scanResults = new AndroidScanResults(scanResultV2Example);

        deviceCommunicatorMock
            .setup(m => m.fetchContent('result'))
            .returns(() => Promise.resolve(JSON.stringify(scanResultV2Example)))
            .verifiable(Times.once());

        telemetryEventHandlerMock
            .setup(handler =>
                handler.publishTelemetry(SCAN_STARTED, It.isValue(expectedScanStartedTelemetry)),
            )
            .verifiable(Times.once(), ExpectedCallType.InSequence);

        telemetryEventHandlerMock
            .setup(handler =>
                handler.publishTelemetry(
                    SCAN_COMPLETED,
                    It.isValue({
                        telemetry: {
                            scanDuration: 135000,
                            PASS: {
                                ColorContrast: 2,
                                ActiveViewName: 4,
                                DontMoveAccessibilityFocus: 1,
                                TouchSizeWcag: 3,
                            },
                            FAIL: {
                                ImageViewName: 1,
                                TouchSizeWcag: 1,
                                ColorContrast: 2,
                                EditTextValue: 1,
                                EditTextName: 1,
                            },
                            INCOMPLETE: {
                                ColorContrast: 2,
                            },
                            ERROR: {
                                EditableContentDescCheck: 1,
                                TouchTargetSizeCheck: 1,
                            },
                            WARNING: {
                                TextContrastCheck: 5,
                            },
                            INFO: {
                                DuplicateSpeakableTextCheck: 1,
                            },
                            RESOLVED: {},
                        },
                    }),
                ),
            )
            .verifiable(Times.once(), ExpectedCallType.InSequence);

        const unifiedPayload: UnifiedScanCompletedPayload = {
            rules: [],
            scanResult: [],
            targetAppInfo: {
                name: 'test-target-app-info-name',
                url: 'test-target-app-info-url',
            },
            toolInfo: {
                applicationProperties: null,
                scanEngineProperties: {
                    name: 'test-scan-engine-name',
                    version: 'test-scan-engine-version',
                },
            },
            timestamp: 'timestamp',
            scanIncompleteWarnings: ['test-scan-incomplete-warning' as ScanIncompleteWarningId],
        };

        unifiedResultsBuilderMock
            .setup(builder => builder(scanResults))
            .returns(() => unifiedPayload);

        const unifiedScanCompletedMock = Mock.ofType<Action<UnifiedScanCompletedPayload>>();
        unifiedScanCompletedMock
            .setup(action => action.invoke(unifiedPayload))
            .verifiable(Times.once());

        unifiedScanResultActionsMock
            .setup(actions => actions.scanCompleted)
            .returns(() => unifiedScanCompletedMock.object);

        testSubject.initialize();

        await tick();

        scanCompletedMock.verify(scanCompleted => scanCompleted.invoke(null), Times.once());
        deviceConnectedMock.verify(m => m.invoke(null), Times.once());

        telemetryEventHandlerMock.verifyAll();
        deviceCommunicatorMock.verifyAll();
    });

    it('scans and handle error ', async () => {
        const errorReason = 'fake reason';

        deviceCommunicatorMock
            .setup(m => m.fetchContent('result'))
            .returns(() => Promise.reject(errorReason))
            .verifiable(Times.once());

        telemetryEventHandlerMock
            .setup(handler =>
                handler.publishTelemetry(SCAN_STARTED, It.isValue(expectedScanStartedTelemetry)),
            )
            .verifiable(Times.once(), ExpectedCallType.InSequence);

        telemetryEventHandlerMock
            .setup(handler =>
                handler.publishTelemetry(
                    SCAN_FAILED,
                    It.isValue({
                        telemetry: {
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
        deviceDisconnectedMock.verify(m => m.invoke(null), Times.once());
        deviceCommunicatorMock.verifyAll();
        telemetryEventHandlerMock.verifyAll();
    });
});
