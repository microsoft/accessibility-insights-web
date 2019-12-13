// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AppUpdater, UpdateCheckResult, Logger } from 'electron-updater';
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
        const autoUpdaterClient = new AutoUpdaterClient(autoUpdaterMock.object, null);
        await autoUpdaterClient.check();

        autoUpdaterMock.verifyAll();
    });

    it('sets up logger in constructor', async () => {
        const logger = Mock.ofType<Logger>();
        new AutoUpdaterClient(autoUpdaterMock.object, logger.object);
        autoUpdaterMock.verify(m => (m.logger = logger.object), Times.once());
    });
});
