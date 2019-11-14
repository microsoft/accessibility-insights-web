// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
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
        // getTitle() is normally synchronous in Electron, but Spectron overrides this and makes it async, confusing Typescript
        // tslint:disable-next-line: await-promise
        return await this.app.webContents.getTitle();
    }

    public async openDeviceConnectionDialog(): Promise<
        DeviceConnectionDialogController
    > {
        await dismissTelemetryOptInDialog(this.app);

        const deviceConnectionDialog = new DeviceConnectionDialogController(
            this.client,
        );
        await deviceConnectionDialog.waitForVisible();

        return deviceConnectionDialog;
    }

    public async openAutomatedChecksView(): Promise<
        AutomatedChecksViewController
    > {
        const deviceConnectionDialog = await this.openDeviceConnectionDialog();
        await deviceConnectionDialog.connectToPort(
            testResourceServerConfig.port,
        );

        const automatedChecksView = new AutomatedChecksViewController(
            this.client,
        );
        await automatedChecksView.waitForVisible();

        return automatedChecksView;
    }
}
