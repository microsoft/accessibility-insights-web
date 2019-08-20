// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as Electron from 'electron';
import { Application } from 'spectron';
import * as WebdriverIO from 'webdriverio';
import { CommonSelectors } from './common/element-identifiers/common-selectors';
import { DEFAULT_ELECTRON_TEST_TIMEOUT_MS } from './setup/timeouts';

describe('Electron E2E', () => {
    let app: Application;

    beforeEach(() => {
        const electronPath = `${(global as any).rootDir}/drop/electron/extension/bundle/main.bundle.js`;
        app = new Application({
            path: Electron as any,
            args: [electronPath],
        });

        return app.start();
    });

    // spectron wraps calls to electron APIs as promises. Unfortunately, only electron typings are used,
    // so tslint thinks some of the methods do not return promises.
    // tslint:disable: await-promise

    // tslint:disable-next-line:typedef
    async function ensureAppIsInDeviceConnectionDialog() {
        const webDriverClient: WebdriverIO.Client<void> = app.client;
        await webDriverClient.waitForVisible(CommonSelectors.deviceViewContainer, DEFAULT_ELECTRON_TEST_TIMEOUT_MS);
        expect(await app.webContents.getTitle()).toBe('Accessibility Insights for Mobile');
    }

    test('test that app opened & set initial state', async () => {
        await ensureAppIsInDeviceConnectionDialog();

        const webDriverClient: WebdriverIO.Client<void> = app.client;
        expect(await webDriverClient.isEnabled(CommonSelectors.cancelButton)).toBe(true);
        expect(await webDriverClient.isEnabled(CommonSelectors.portNumber)).toBe(true);
        expect(await webDriverClient.isEnabled(CommonSelectors.startButton)).toBe(false);
        expect(await webDriverClient.isEnabled(CommonSelectors.validateButton)).toBe(false);
    });

    test('test that validate port remains disabled when we provide an invalid port number', async () => {
        await ensureAppIsInDeviceConnectionDialog();

        const webDriverClient: WebdriverIO.Client<void> = app.client;
        await webDriverClient.click(CommonSelectors.portNumber);
        await webDriverClient.element(CommonSelectors.portNumber).keys('abc');
        expect(await webDriverClient.isEnabled(CommonSelectors.validateButton)).toBe(false);
        expect(await webDriverClient.isEnabled(CommonSelectors.startButton)).toBe(false);
    });

    test('test that validate port enables when we provide a valid port number', async () => {
        await ensureAppIsInDeviceConnectionDialog();

        const webDriverClient: WebdriverIO.Client<void> = app.client;
        await webDriverClient.click(CommonSelectors.portNumber);
        await webDriverClient.element(CommonSelectors.portNumber).keys('999');
        expect(await webDriverClient.isEnabled(CommonSelectors.validateButton)).toBe(true);
        expect(await webDriverClient.isEnabled(CommonSelectors.startButton)).toBe(false);
    });

    // tslint:enable: await-promise

    afterEach(() => {
        if (app && app.isRunning()) {
            return app.stop();
        }
    });
});
