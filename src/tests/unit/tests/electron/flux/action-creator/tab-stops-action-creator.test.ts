// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { TelemetryEventHandler } from 'background/telemetry/telemetry-event-handler';
import { Action } from 'common/flux/action';
import { Logger } from 'common/logging/logger';
import { DEVICE_FOCUS_ERROR } from 'electron/common/electron-telemetry-events';
import { DeviceConnectionActions } from 'electron/flux/action/device-connection-actions';
import { TabStopsActionCreator } from 'electron/flux/action/tab-stops-action-creator';
import { TabStopsActions } from 'electron/flux/action/tab-stops-actions';
import { KeyEventCode } from 'electron/platform/android/adb-wrapper';
import { DeviceFocusController } from 'electron/platform/android/device-focus-controller';
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';

describe('TabStopsActionCreator', () => {
    let tabStopsActionsMock: IMock<TabStopsActions>;
    let testSubject: TabStopsActionCreator;
    let actionMock: IMock<Action<void>>;
    let deviceFocusControllerMock: IMock<DeviceFocusController>;
    let telemetryEventHandlerMock: IMock<TelemetryEventHandler>;
    let deviceConnectionActionsMock: IMock<DeviceConnectionActions>;
    let loggerMock: IMock<Logger>;
    let statusDisconnectedMock: IMock<Action<void>>;
    let statusConnectedMock: IMock<Action<void>>;

    beforeEach(() => {
        tabStopsActionsMock = Mock.ofType<TabStopsActions>();
        actionMock = Mock.ofType<Action<void>>();
        deviceFocusControllerMock = Mock.ofType<DeviceFocusController>(
            undefined,
            MockBehavior.Strict,
        );
        telemetryEventHandlerMock = Mock.ofType<TelemetryEventHandler>(
            undefined,
            MockBehavior.Strict,
        );
        deviceConnectionActionsMock = Mock.ofType<DeviceConnectionActions>(
            undefined,
            MockBehavior.Strict,
        );
        loggerMock = Mock.ofType<Logger>(undefined, MockBehavior.Strict);
        statusDisconnectedMock = Mock.ofType<Action<void>>();
        statusConnectedMock = Mock.ofType<Action<void>>();

        testSubject = new TabStopsActionCreator(
            tabStopsActionsMock.object,
            deviceConnectionActionsMock.object,
            deviceFocusControllerMock.object,
            loggerMock.object,
            telemetryEventHandlerMock.object,
        );
    });

    describe('Success paths', () => {
        it('enableTabStops', async () => {
            deviceFocusControllerMock
                .setup(m => m.enableFocusTracking())
                .returns(() => Promise.resolve());
            tabStopsActionsMock.setup(m => m.enableFocusTracking).returns(() => actionMock.object);
            setFocusActionsForSuccess();

            await testSubject.enableTabStops();

            actionMock.verify(m => m.invoke(), Times.once());
            verifyAllMocks();
        });

        it('disableTabStops', async () => {
            deviceFocusControllerMock
                .setup(m => m.disableFocusTracking())
                .returns(() => Promise.resolve());
            tabStopsActionsMock.setup(m => m.disableFocusTracking).returns(() => actionMock.object);
            setFocusActionsForSuccess();

            await testSubject.disableTabStops();

            actionMock.verify(m => m.invoke(), Times.once());
            verifyAllMocks();
        });

        it('startOver', async () => {
            deviceFocusControllerMock
                .setup(m => m.resetFocusTracking())
                .returns(() => Promise.resolve());
            tabStopsActionsMock.setup(m => m.startOver).returns(() => actionMock.object);
            setFocusActionsForSuccess();

            await testSubject.startOver();

            actionMock.verify(m => m.invoke(), Times.once());
            verifyAllMocks();
        });

        it('sendUpKey', async () => {
            await testSendKeyEventSuccess(KeyEventCode.Up, 'sendUpKey');
        });

        it('sendDownKey', async () => {
            await testSendKeyEventSuccess(KeyEventCode.Down, 'sendDownKey');
        });

        it('sendLeftKey', async () => {
            await testSendKeyEventSuccess(KeyEventCode.Left, 'sendLeftKey');
        });

        it('sendRightKey', async () => {
            await testSendKeyEventSuccess(KeyEventCode.Right, 'sendRightKey');
        });

        it('sendTabKey', async () => {
            await testSendKeyEventSuccess(KeyEventCode.Tab, 'sendTabKey');
        });

        it('sendEnterKey', async () => {
            await testSendKeyEventSuccess(KeyEventCode.Enter, 'sendEnterKey');
        });

        function setFocusActionsForSuccess(): void {
            statusConnectedMock.setup(m => m.invoke()).verifiable(Times.once());
            deviceConnectionActionsMock
                .setup(m => m.statusConnected)
                .returns(() => statusConnectedMock.object)
                .verifiable(Times.once());
        }

        async function testSendKeyEventSuccess(
            keyEventCode: KeyEventCode,
            funcName: keyof TabStopsActionCreator,
        ): Promise<void> {
            setFocusActionsForSuccess();
            deviceFocusControllerMock
                .setup(m => m.sendKeyEvent(keyEventCode))
                .returns(() => Promise.resolve());

            await testSubject[funcName]();

            verifyAllMocks();
        }
    });

    describe('Error paths', () => {
        const errorMessage: string = 'error message stub';

        it('enableTabStops', async () => {
            deviceFocusControllerMock
                .setup(m => m.enableFocusTracking())
                .returns(() => Promise.reject(errorMessage));

            tabStopsActionsMock.setup(m => m.enableFocusTracking).returns(() => actionMock.object);
            setMocksForFocusError();

            await testSubject.enableTabStops();

            actionMock.verify(m => m.invoke(), Times.never());
            verifyAllMocks();
        });

        it('disableTabStops', async () => {
            deviceFocusControllerMock
                .setup(m => m.disableFocusTracking())
                .returns(() => Promise.reject(errorMessage));

            tabStopsActionsMock.setup(m => m.disableFocusTracking).returns(() => actionMock.object);
            setMocksForFocusError();

            await testSubject.disableTabStops();

            actionMock.verify(m => m.invoke(), Times.never());
            verifyAllMocks();
        });

        it('startOver', async () => {
            deviceFocusControllerMock
                .setup(m => m.resetFocusTracking())
                .returns(() => Promise.reject(errorMessage));

            tabStopsActionsMock.setup(m => m.startOver).returns(() => actionMock.object);
            setMocksForFocusError();

            await testSubject.startOver();

            actionMock.verify(m => m.invoke(), Times.never());
            verifyAllMocks();
        });

        it('sendUpKey', async () => {
            await testSendKeyEventError(KeyEventCode.Up, 'sendUpKey');
        });

        it('sendDownKey', async () => {
            await testSendKeyEventError(KeyEventCode.Down, 'sendDownKey');
        });

        it('sendLeftKey', async () => {
            await testSendKeyEventError(KeyEventCode.Left, 'sendLeftKey');
        });

        it('sendRightKey', async () => {
            await testSendKeyEventError(KeyEventCode.Right, 'sendRightKey');
        });

        it('sendTabKey', async () => {
            await testSendKeyEventError(KeyEventCode.Tab, 'sendTabKey');
        });

        it('sendEnterKey', async () => {
            await testSendKeyEventError(KeyEventCode.Enter, 'sendEnterKey');
        });

        async function testSendKeyEventError(
            keyEventCode: KeyEventCode,
            funcName: keyof TabStopsActionCreator,
        ): Promise<void> {
            setMocksForFocusError();
            deviceFocusControllerMock
                .setup(m => m.sendKeyEvent(keyEventCode))
                .returns(() => Promise.reject(errorMessage));

            await testSubject[funcName]();

            verifyAllMocks();
        }

        function setMocksForFocusError(): void {
            telemetryEventHandlerMock
                .setup(m => m.publishTelemetry(DEVICE_FOCUS_ERROR, {}))
                .verifiable(Times.once());
            loggerMock
                .setup(m => m.log('focus controller failure: ' + errorMessage))
                .verifiable(Times.once());
            statusDisconnectedMock
                .setup(m => m.invoke((It.isAny(), It.isAny())))
                .verifiable(Times.once());
            deviceConnectionActionsMock
                .setup(m => m.statusDisconnected)
                .returns(() => statusDisconnectedMock.object)
                .verifiable(Times.once());
        }
    });

    function verifyAllMocks(): void {
        telemetryEventHandlerMock.verifyAll();
        deviceConnectionActionsMock.verifyAll();
        loggerMock.verifyAll();
        statusDisconnectedMock.verifyAll();
        statusConnectedMock.verifyAll();
    }
});
