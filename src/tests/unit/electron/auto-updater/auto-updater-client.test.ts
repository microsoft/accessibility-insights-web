// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AppUpdater, UpdateCheckResult } from 'electron-updater';
import { AutoUpdaterClient } from 'electron/auto-update/auto-updater-client';
import { IMock, Mock, Times } from 'typemoq';

describe('AutoUpdaterClient', () => {
    const autoUpdaterMock: IMock<AppUpdater> = Mock.ofType<AppUpdater>();
    beforeAll(() => {
        const mockModel = Mock.ofType<UpdateCheckResult>();
        mockModel.setup((x: any) => x.then).returns(() => undefined);

        autoUpdaterMock
            .setup(x => x.checkForUpdatesAndNotify())
            .returns(() => Promise.resolve(mockModel.object))
            .verifiable(Times.once());
    });

    it('auto-updater client checkForUpdatesAndNotify is called when we call check', async () => {
        const autoUpdaterClient = new AutoUpdaterClient(autoUpdaterMock.object);
        await autoUpdaterClient.check();

        autoUpdaterMock.verifyAll();
    });
});
