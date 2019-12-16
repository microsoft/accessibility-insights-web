// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { createDefaultPromiseFactory } from 'common/promises/promise-factory';
import { mainWindowConfig } from 'electron/main/main-window-config';
import { Application } from 'spectron';
import { DeviceConnectionDialogController } from 'tests/electron/common/view-controllers/device-connection-dialog-controller';
import { testResourceServerConfig } from 'tests/electron/setup/test-resource-server-config';
import { DEFAULT_PAGE_ELEMENT_WAIT_TIMEOUT_MS } from 'tests/end-to-end/common/timeouts';
import * as WebDriverIO from 'webdriverio';
import { dismissTelemetryOptInDialog } from '../dismiss-telemetry-opt-in-dialog';
import { AutomatedChecksViewController } from './automated-checks-view-controller';

// These are workarounds for https://github.com/electron-userland/spectron/issues/343
//
// Note that this is *not an exhaustive list* of the actually-promise APIs from spectron; this is
// only the set of APIs we happen to be using as of writing.
declare module 'spectron' {
    export interface SpectronWebContents {
        getTitle(): Promise<string>;
    }
    export interface SpectronWindow {
        getBounds(): Promise<Electron.Rectangle>;
        isMaximized(): Promise<boolean>;

        // Note: Promise only defers for webdriver to accept the command, does *not* wait for
        // command to actually have taken effect
        unmaximize(): Promise<void>;

        // Note: Promise only defers for webdriver to accept the command, does *not* wait for
        // command to actually have taken effect
        setBounds(bounds: Partial<Electron.Rectangle>): Promise<void>;
    }
}

export class AppController {
    public client: WebDriverIO.Client<void>;
    private promiseFactory = createDefaultPromiseFactory();

    constructor(public app: Application) {
        this.client = app.client;
    }

    public async stop(): Promise<void> {
        if (this.app && this.app.isRunning()) {
            await this.app.stop();
        }
    }

    public async getTitle(): Promise<string> {
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

    private async setBounds(bounds: { width: number; height: number }): Promise<void> {
        await this.app.browserWindow.setBounds(bounds);

        const boundsAreSetTo = candidateBounds => bounds.width === candidateBounds.width && bounds.height === candidateBounds.height;
        const boundsAreSet = async () => boundsAreSetTo(await this.app.browserWindow.getBounds());
        await this.promiseFactory.poll(boundsAreSet, { timeoutInMilliseconds: DEFAULT_PAGE_ELEMENT_WAIT_TIMEOUT_MS });
    }

    private async unmaximize(): Promise<void> {
        await this.app.browserWindow.unmaximize();

        const isUnmaximized = async () => !(await this.app.browserWindow.isMaximized());
        await this.promiseFactory.poll(isUnmaximized, { timeoutInMilliseconds: DEFAULT_PAGE_ELEMENT_WAIT_TIMEOUT_MS });
    }
}
