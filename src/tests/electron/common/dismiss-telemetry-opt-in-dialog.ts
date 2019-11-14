// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Application } from 'spectron';
import { DEFAULT_ELECTRON_TEST_TIMEOUT_MS } from 'tests/electron/setup/timeouts';
import { popupPageElementIdentifiers } from 'tests/end-to-end/common/element-identifiers/popup-page-element-identifiers';
import { Client } from 'webdriverio';

export async function dismissTelemetryOptInDialog(
    app: Application,
): Promise<void> {
    const webDriverClient: Client<void> = app.client;

    await webDriverClient.waitForVisible(
        popupPageElementIdentifiers.telemetryDialog,
        DEFAULT_ELECTRON_TEST_TIMEOUT_MS,
    );
    await webDriverClient.click(
        popupPageElementIdentifiers.startUsingProductButton,
    );
}
