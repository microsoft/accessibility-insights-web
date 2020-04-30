// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ElectronAppDataAdapter } from 'electron/adapters/electron-app-data-adapter';
import { IpcRendererShim } from 'electron/ipc/ipc-renderer-shim';
import { IMock, Mock, MockBehavior, Times } from 'typemoq';

describe(ElectronAppDataAdapter, () => {
    let ipcRendererShimMock: IMock<IpcRendererShim>;
    let testSubject: ElectronAppDataAdapter;

    beforeEach(() => {
        ipcRendererShimMock = Mock.ofType<IpcRendererShim>(undefined, MockBehavior.Strict);
        testSubject = new ElectronAppDataAdapter(ipcRendererShimMock.object);
    });

    afterEach(() => {
        ipcRendererShimMock.verifyAll();
    });

    it('do nothing at construction', () => {});

    it('chain to shim on getVersion', () => {
        const expectedVersion = 'New super duper version';

        ipcRendererShimMock
            .setup(b => b.getVersion())
            .returns(() => expectedVersion)
            .verifiable(Times.once());
        expect(testSubject.getVersion()).toBe(expectedVersion);
    });
});
