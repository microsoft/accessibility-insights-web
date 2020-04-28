// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { SpectronWindow } from 'spectron';
import * as WebDriverIO from 'webdriverio';

// SpectronClient is intentionally protected to limit accidental
// async/sync confusion by e2e test writers
export interface SpectronAsyncClient {
    // https://github.com/electron-userland/spectron/blob/cd733c4bc6b28eb5a1041ed79eef5563e75432ae/lib/api.js#L311
    browserWindow: SpectronWindow;

    $(selector: string): Promise<WebDriverIO.RawResult<any>>;
    $$(selector: string): Promise<WebDriverIO.RawResult<any>[]>;
    click(selector?: string): Promise<void>;
    executeAsync(script: string | ((...args: any[]) => void), ...args: any[]): Promise<any>;
    execute(script: string | ((...args: any[]) => void), ...args: any[]): Promise<any>;
    getAttribute<P>(selector: string, attributeName: string): Promise<P>;
    getText(selector?: string): Promise<string>;
    isEnabled(selector?: string): Promise<boolean>;
    keys(keys: string): Promise<void>;
    pause(milliseconds: number): Promise<void>;
    waitForEnabled(selector: string, milliseconds?: number, reverse?: boolean): Promise<boolean>;
    waitUntil(
        condition: () =>
            | boolean
            | Promise<boolean>
            | (WebDriverIO.Client<WebDriverIO.RawResult<any>> & WebDriverIO.RawResult<any>),
        timeout?: number,
        timeoutMsg?: string,
        interval?: number,
    ): Promise<boolean>;
    waitForExist(selector: string, milliseconds?: number, reverse?: boolean): Promise<boolean>;
}
