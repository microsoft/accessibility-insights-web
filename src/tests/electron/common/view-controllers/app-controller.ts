// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AndroidSetupStepId } from 'electron/platform/android/setup/android-setup-step-id';
import { Application } from 'spectron';
import { AndroidSetupViewController } from 'tests/electron/common/view-controllers/android-setup-view-controller';
import { DeviceConnectionDialogController } from 'tests/electron/common/view-controllers/device-connection-dialog-controller';
import {
    getSpectronAsyncClient,
    SpectronAsyncClient,
} from 'tests/electron/common/view-controllers/spectron-async-client';
import { DEFAULT_WAIT_FOR_ELEMENT_TO_BE_VISIBLE_TIMEOUT_MS } from 'tests/electron/setup/timeouts';
import { AutomatedChecksViewController } from './automated-checks-view-controller';

export class AppController {
    public client: SpectronAsyncClient;

    constructor(public app: Application) {
        this.client = getSpectronAsyncClient(app.client, app.browserWindow);
    }

    public async stop(): Promise<void> {
        if (this.app && this.app.isRunning()) {
            await this.app.stop();
        }
    }

    public async waitForTitle(expectedTitle: string): Promise<void> {
        const timeout = DEFAULT_WAIT_FOR_ELEMENT_TO_BE_VISIBLE_TIMEOUT_MS;
        await this.client.waitUntil(
            async () => {
                const title = await this.app.webContents.getTitle();
                return title === expectedTitle;
            },
            {
                timeout,
                timeoutMsg: `was expecting window title to transition to ${expectedTitle} within ${timeout}ms`,
            },
        );
    }

    public async openDeviceConnectionDialog(): Promise<DeviceConnectionDialogController> {
        const deviceConnectionDialog = new DeviceConnectionDialogController(this.client);
        await deviceConnectionDialog.waitForDialogVisible();

        return deviceConnectionDialog;
    }

    public async openAndroidSetupView(
        step: AndroidSetupStepId,
    ): Promise<AndroidSetupViewController> {
        const androidSetupController = new AndroidSetupViewController(this.client);
        await androidSetupController.waitForDialogVisible(step);
        return androidSetupController;
    }

    public async openAutomatedChecksView(): Promise<AutomatedChecksViewController> {
        const androidSetupViewController = await this.openAndroidSetupView(
            'prompt-connected-start-testing',
        );
        await androidSetupViewController.startTesting();

        return this.waitForAutomatedChecksView();
    }

    public async waitForAutomatedChecksView(): Promise<AutomatedChecksViewController> {
        const automatedChecksView = new AutomatedChecksViewController(this.client);
        await automatedChecksView.waitForViewVisible();

        return automatedChecksView;
    }

    public async setHighContrastMode(enableHighContrast: boolean): Promise<void> {
        await this.waitForWindowPropertyInitialized('insightsUserConfiguration');

        await this.app.webContents.executeJavaScript(
            `window.insightsUserConfiguration.setHighContrastMode(${enableHighContrast})`,
        );
    }

    public async waitForHighContrastMode(expectedHighContrastMode: boolean): Promise<void> {
        const highContrastThemeClass = 'high-contrast-theme';

        await this.client.waitUntil(
            async () => {
                const classes = await this.client.getAttribute('body', 'class');
                return expectedHighContrastMode === classes.includes(highContrastThemeClass);
            },
            {
                timeout: DEFAULT_WAIT_FOR_ELEMENT_TO_BE_VISIBLE_TIMEOUT_MS,
                timeoutMsg: `was expecting body element ${
                    expectedHighContrastMode ? 'with' : 'without'
                } class high-contrast-theme`,
            },
        );
    }

    public async setTelemetryState(enableTelemetry: boolean): Promise<void> {
        await this.waitForWindowPropertyInitialized('insightsUserConfiguration');

        await this.app.webContents.executeJavaScript(
            `window.insightsUserConfiguration.setTelemetryState(${enableTelemetry})`,
        );
    }

    public async setFeatureFlag(flag: string, enabled: boolean): Promise<void> {
        await this.waitForWindowPropertyInitialized('featureFlagsController');
        const action = enabled ? 'enable' : 'disable';
        await this.app.webContents.executeJavaScript(
            `window.featureFlagsController.${action}Feature('${flag}')`,
        );
    }

    private async waitForWindowPropertyInitialized(
        propertyName: 'insightsUserConfiguration' | 'featureFlagsController',
    ): Promise<void> {
        await this.client.waitUntil(
            async () => {
                return await this.client.executeAsync((prop, done) => {
                    done((window as any)[prop] != null);
                }, propertyName);
            },
            {
                timeout: DEFAULT_WAIT_FOR_ELEMENT_TO_BE_VISIBLE_TIMEOUT_MS,
                timeoutMsg: `was expecting window.${propertyName} to be defined`,
            },
        );
    }
}
