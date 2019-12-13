// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { mainWindowConfig } from 'electron/main/main-window-config';
import { Application } from 'spectron';
import { DeviceConnectionDialogController } from 'tests/electron/common/view-controllers/device-connection-dialog-controller';
import { testResourceServerConfig } from 'tests/electron/setup/test-resource-server-config';
import * as WebDriverIO from 'webdriverio';
import { dismissTelemetryOptInDialog } from '../dismiss-telemetry-opt-in-dialog';
import { AutomatedChecksViewController } from './automated-checks-view-controller';

export class AppController {
    public client: WebDriverIO.Client<void>;

    constructor(public app: Application) {
        this.client = app.client;
    }

    public async stop(): Promise<void> {
        if (this.app && this.app.isRunning()) {
            await this.app.stop();
        }
    }

    public async getTitle(): Promise<string> {
        // Typings are inaccurate; see https://github.com/electron-userland/spectron/issues/343
        // tslint:disable-next-line: await-promise
        return await this.app.webContents.getTitle();
    }

    public async openDeviceConnectionDialog(): Promise<DeviceConnectionDialogController> {
        await this.setToMinimumSupportedWindowSize();

        await dismissTelemetryOptInDialog(this.app);

        const deviceConnectionDialog = new DeviceConnectionDialogController(this.client);
        await deviceConnectionDialog.waitForDialogVisible();

        return deviceConnectionDialog;
    }

    public async openAutomatedChecksView(): Promise<AutomatedChecksViewController> {
        const deviceConnectionDialog = await this.openDeviceConnectionDialog();
        await deviceConnectionDialog.connectToPort(testResourceServerConfig.port);

        const automatedChecksView = new AutomatedChecksViewController(this.client);
        await automatedChecksView.waitForViewVisible();

        await this.setToMinimumSupportedWindowSize();

        return automatedChecksView;
    }

    private async setToMinimumSupportedWindowSize(): Promise<void> {
        await this.unmaximize();

        const minimumSupportedBounds = { width: mainWindowConfig.minWidth, height: mainWindowConfig.minHeight };
        await this.setBounds(minimumSupportedBounds);
    }

    private setBounds(bounds: { width: number; height: number }): Promise<void> {
        // Typings are inaccurate; see https://github.com/electron-userland/spectron/issues/343
        return this.app.browserWindow.setBounds(bounds) as any;
    }

    private unmaximize(): Promise<void> {
        // Typings are inaccurate; see https://github.com/electron-userland/spectron/issues/343
        return this.app.browserWindow.unmaximize() as any;
    }
}
