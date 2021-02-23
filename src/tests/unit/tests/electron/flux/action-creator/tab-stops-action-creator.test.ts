// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Action } from 'common/flux/action';
import { TabStopsActionCreator } from 'electron/flux/action/tab-stops-action-creator';
import { TabStopsActions } from 'electron/flux/action/tab-stops-actions';
import { DeviceFocusController } from 'electron/platform/android/device-focus-controller';
import { IMock, Mock, Times } from 'typemoq';

describe('TabStopsActionCreator', () => {
    let tabStopsActionsMock: IMock<TabStopsActions>;
    let testSubject: TabStopsActionCreator;
    let actionMock: IMock<Action<void>>;
    let deviceFocusControllerMock: IMock<DeviceFocusController>;

    beforeEach(() => {
        tabStopsActionsMock = Mock.ofType<TabStopsActions>();
        actionMock = Mock.ofType<Action<void>>();
        deviceFocusControllerMock = Mock.ofType<DeviceFocusController>();

        testSubject = new TabStopsActionCreator(
            tabStopsActionsMock.object,
            deviceFocusControllerMock.object,
        );
    });

    it('enableTabStops', () => {
        tabStopsActionsMock.setup(m => m.enableFocusTracking).returns(() => actionMock.object);

        testSubject.enableTabStops();

        actionMock.verify(m => m.invoke(), Times.once());
        deviceFocusControllerMock.verify(m => m.enableFocusTracking(), Times.once());
    });

    it('disableTabStops', () => {
        tabStopsActionsMock.setup(m => m.disableFocusTracking).returns(() => actionMock.object);

        testSubject.disableTabStops();

        actionMock.verify(m => m.invoke(), Times.once());
        deviceFocusControllerMock.verify(m => m.disableFocusTracking(), Times.once());
    });

    it('startOver', () => {
        tabStopsActionsMock.setup(m => m.startOver).returns(() => actionMock.object);

        testSubject.startOver();

        actionMock.verify(m => m.invoke(), Times.once());
        deviceFocusControllerMock.verify(m => m.resetFocusTracking(), Times.once());
    });

    it('sendUpKey', () => {
        testSubject.sendUpKey();
        deviceFocusControllerMock.verify(m => m.sendUpKey(), Times.once());
    });

    it('sendDownKey', () => {
        testSubject.sendDownKey();
        deviceFocusControllerMock.verify(m => m.sendDownKey(), Times.once());
    });

    it('sendLeftKey', () => {
        testSubject.sendLeftKey();
        deviceFocusControllerMock.verify(m => m.sendLeftKey(), Times.once());
    });

    it('sendRightKey', () => {
        testSubject.sendRightKey();
        deviceFocusControllerMock.verify(m => m.sendRightKey(), Times.once());
    });

    it('sendTabKey', () => {
        testSubject.sendTabKey();
        deviceFocusControllerMock.verify(m => m.sendTabKey(), Times.once());
    });

    it('sendEnterKey', () => {
        testSubject.sendEnterKey();
        deviceFocusControllerMock.verify(m => m.sendEnterKey(), Times.once());
    });
});
