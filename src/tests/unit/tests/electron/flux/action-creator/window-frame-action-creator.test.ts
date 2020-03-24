// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { Action } from 'common/flux/action';
import { WindowFrameActionCreator } from 'electron/flux/action-creator/window-frame-action-creator';
import { WindowFrameActions } from 'electron/flux/action/window-frame-actions';
import { SetSizePayload } from 'electron/flux/action/window-frame-actions-payloads';
import { IMock, Mock, Times } from 'typemoq';

describe(WindowFrameActionCreator, () => {
    let windowFrameActionsMock: IMock<WindowFrameActions>;
    let testSubject: WindowFrameActionCreator;

    beforeEach(() => {
        windowFrameActionsMock = Mock.ofType<WindowFrameActions>();
        testSubject = new WindowFrameActionCreator(windowFrameActionsMock.object);
    });

    it('calling setWindowSize invokes setWindowSize action with given payload', () => {
        const setRouteActionMock = Mock.ofType<Action<SetSizePayload>>();
        const testPayload: SetSizePayload = {
            height: 1,
            width: 2,
        };
        windowFrameActionsMock
            .setup(actions => actions.setWindowSize)
            .returns(() => setRouteActionMock.object);
        setRouteActionMock.setup(s => s.invoke(testPayload)).verifiable(Times.once());

        testSubject.setWindowSize(testPayload);

        setRouteActionMock.verifyAll();
    });

    it('calling maximize invokes maximize action', () => {
        const maximizeActionMock = Mock.ofType<Action<void>>();

        windowFrameActionsMock
            .setup(actions => actions.maximize)
            .returns(() => maximizeActionMock.object);
        maximizeActionMock.setup(s => s.invoke()).verifiable(Times.once());

        testSubject.maximize();

        maximizeActionMock.verifyAll();
    });

    it('calling minimize invokes minimize action', () => {
        const minimizeActionMock = Mock.ofType<Action<void>>();

        windowFrameActionsMock
            .setup(actions => actions.minimize)
            .returns(() => minimizeActionMock.object);
        minimizeActionMock.setup(s => s.invoke()).verifiable(Times.once());

        testSubject.minimize();

        minimizeActionMock.verifyAll();
    });

    it('calling maximize invokes restore action', () => {
        const restoreActionMock = Mock.ofType<Action<void>>();

        windowFrameActionsMock
            .setup(actions => actions.restore)
            .returns(() => restoreActionMock.object);
        restoreActionMock.setup(s => s.invoke()).verifiable(Times.once());

        testSubject.restore();

        restoreActionMock.verifyAll();
    });

    it('calling close invokes close action', () => {
        const closeActionMock = Mock.ofType<Action<void>>();

        windowFrameActionsMock
            .setup(actions => actions.close)
            .returns(() => closeActionMock.object);
        closeActionMock.setup(s => s.invoke()).verifiable(Times.once());

        testSubject.close();

        closeActionMock.verifyAll();
    });
});
