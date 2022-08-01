// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { UnifiedScanCompletedPayload } from 'background/actions/action-payloads';
import { UnifiedScanResultActions } from 'background/actions/unified-scan-result-actions';
import { TelemetryEventHandler } from 'background/telemetry/telemetry-event-handler';
import { TelemetryEventSource } from 'common/extension-telemetry-events';
import { AsyncAction } from 'common/flux/async-action';
import { SyncAction } from 'common/flux/sync-action';
import { Logger } from 'common/logging/logger';
import { ScanIncompleteWarningId } from 'common/types/store-data/scan-incomplete-warnings';
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
import { androidScanResultExample } from 'tests/common/android-scan-result-example';
import { ExpectedCallType, IMock, It, Mock, MockBehavior, Times } from 'typemoq';

describe('ScanController', () => {
    const actionExecutingScope = 'ScanController';
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
    let scanStartedMock: IMock<AsyncAction<void>>;
    let scanCompletedMock: IMock<SyncAction<void>>;
    let scanFailedMock: IMock<SyncAction<void>>;

    let deviceConnectionActionsMock: IMock<DeviceConnectionActions>;
    let deviceConnectedMock: IMock<AsyncAction<void>>;
    let deviceDisconnectedMock: IMock<AsyncAction<void>>;

    let unifiedScanResultActionsMock: IMock<UnifiedScanResultActions>;
    let unifiedResultsBuilderMock: IMock<UnifiedScanCompletedPayloadBuilder>;

    let testSubject: ScanController;

    beforeEach(() => {
        telemetryEventHandlerMock = Mock.ofType<TelemetryEventHandler>();
        deviceCommunicatorMock = Mock.ofType<DeviceCommunicator>();
        scanActionsMock = Mock.ofType<ScanActions>();

        scanStartedMock = Mock.ofType<AsyncAction<void>>();
        scanCompletedMock = Mock.ofType<SyncAction<void>>();
        scanFailedMock = Mock.ofType<SyncAction<void>>();

        deviceConnectedMock = Mock.ofType<AsyncAction<void>>();
        deviceDisconnectedMock = Mock.ofType<AsyncAction<void>>();
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
        const scanResults = new AndroidScanResults(androidScanResultExample);

        deviceCommunicatorMock
            .setup(m => m.fetchContent('result'))
            .returns(() => Promise.resolve(JSON.stringify(androidScanResultExample)))
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

        let scanStartedListener: () => Promise<void>;
        scanStartedMock
            .setup(scanStarted => scanStarted.addListener(It.is(isFunction)))
            .callback(listener => (scanStartedListener = listener));

        const unifiedScanCompletedMock = Mock.ofType<AsyncAction<UnifiedScanCompletedPayload>>();
        unifiedScanCompletedMock
            .setup(action => action.invoke(unifiedPayload, actionExecutingScope))
            .verifiable(Times.once());

        unifiedScanResultActionsMock
            .setup(actions => actions.scanCompleted)
            .returns(() => unifiedScanCompletedMock.object);

        testSubject.initialize();

        expect(scanStartedListener).toBeDefined();
        await scanStartedListener();

        scanCompletedMock.verify(
            scanCompleted => scanCompleted.invoke(undefined, actionExecutingScope),
            Times.once(),
        );
        deviceConnectedMock.verify(m => m.invoke(undefined, actionExecutingScope), Times.once());

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

        let scanStartedListener: () => Promise<void>;
        scanStartedMock
            .setup(scanStarted => scanStarted.addListener(It.is(isFunction)))
            .callback(listener => (scanStartedListener = listener));

        testSubject.initialize();

        expect(scanStartedListener).toBeDefined();
        await scanStartedListener();

        scanFailedMock.verify(
            scanCompleted => scanCompleted.invoke(undefined, actionExecutingScope),
            Times.once(),
        );
        loggerMock.verify(logger => logger.error('scan failed: ', errorReason), Times.once());
        deviceDisconnectedMock.verify(m => m.invoke(undefined, actionExecutingScope), Times.once());
        deviceCommunicatorMock.verifyAll();
        telemetryEventHandlerMock.verifyAll();
    });
});
