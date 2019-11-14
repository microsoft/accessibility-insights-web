// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Action } from 'common/flux/action';
import { ScanActionCreator } from 'electron/flux/action-creator/scan-action-creator';
import { PortPayload } from 'electron/flux/action/device-action-payloads';
import { ScanActions } from 'electron/flux/action/scan-actions';
import { IMock, It, Mock, Times } from 'typemoq';

describe('ScanActionCreator', () => {
    const port = 1111;

    let scanActionsMock: IMock<ScanActions>;
    let scanStartedMock: IMock<Action<PortPayload>>;

    let testSubject: ScanActionCreator;

    beforeEach(() => {
        scanActionsMock = Mock.ofType<ScanActions>();

        scanStartedMock = Mock.ofType<Action<PortPayload>>();

        scanActionsMock
            .setup(actions => actions.scanStarted)
            .returns(() => scanStartedMock.object);

        testSubject = new ScanActionCreator(scanActionsMock.object);
    });

    it('scans', () => {
        testSubject.scan(port);

        scanStartedMock.verify(
            scanStarted => scanStarted.invoke(It.isValue({ port })),
            Times.once(),
        );
    });
});
