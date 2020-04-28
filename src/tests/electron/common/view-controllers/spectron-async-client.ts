// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { SpectronWindow } from 'spectron';
import * as WebDriverIO from 'webdriverio';

// spectron 10.0.1 includes @types/webdriverio, whose absence
// we worked around when initially consuming spectron.
// @types/webdriver lacks promises, so this file adds
// promise-based signatures that our e2e code can rely on.
// @types/webdriver has been superceded by improved types
// in webdriverio 5 directly, but Spectron has not consumed them

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
