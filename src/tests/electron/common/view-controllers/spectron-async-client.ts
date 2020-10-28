// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { SpectronClient, SpectronWindow } from 'spectron';
import * as WebDriverIO from 'webdriverio';

// spectron 10.0.1 includes @types/webdriverio, whose absence
// we worked around when initially consuming spectron.
// @types/webdriver lacks promises, so this file adds
// promise-based signatures that our e2e code can rely on.
// @types/webdriver has been superceded by improved types
// in webdriverio 5 directly, but Spectron has not consumed them

export function getSpectronAsyncClient(client: SpectronClient, browserWindow: SpectronWindow) {
    const typedAsyncClient: SpectronAsyncClient = {
        browserWindow,
        $: (selector: string) => client.$(selector),
        $$: (selector: string) => client.$$(selector),
        click: async (selector?: string) => {
            const element = await client.$(selector);
            return await element.click();
        },
        execute: (script: string | ((...args: any[]) => void), ...args: any[]) =>
            client.execute(script, ...args),
        executeAsync: (script: string | ((...args: any[]) => void), ...args: any[]) =>
            client.executeAsync(script, ...args),
        getAttribute: async (selector: string, attributeName: string) => {
            const element = await client.$(selector);
            return await element.getAttribute(attributeName);
        },
        getText: async (selector: string) => {
            const element = await client.$(selector);
            return await element.getText();
        },
        isEnabled: async (selector: string) => {
            const element = await client.$(selector);
            return await element.isEnabled();
        },
        keys: (keys: string) => client.keys(keys),
        pause: (milliseconds: number) => client.pause(milliseconds),
        waitForEnabled: async (selector: string, milliseconds?: number, reverse?: boolean) => {
            const element = await client.$(selector);
            return await element.waitForEnabled({
                timeout: milliseconds,
                reverse,
            });
        },
        waitForExist: async (
            selector: string,
            milliseconds?: number,
            reverse?: boolean,
            timeoutMsg?: string,
        ) => {
            const element = await client.$(selector);
            return await element.waitForExist({
                timeout: milliseconds,
                reverse,
                timeoutMsg,
            });
        },
        waitUntil: (condition: () => Promise<Boolean>, options?: WebDriverIO.WaitUntilOptions) =>
            client.waitUntil(condition, options),
    };
    return typedAsyncClient as SpectronAsyncClient;
}

export interface SpectronAsyncClient {
    browserWindow: SpectronWindow;
    $(selector: string): Promise<WebDriverIO.Element>;
    $$(selector: string): Promise<WebDriverIO.Element[]>;
    click(selector?: string): Promise<void>;
    executeAsync(script: string | ((...args: any[]) => void), ...args: any[]): Promise<any>;
    execute(script: string | ((...args: any[]) => void), ...args: any[]): Promise<any>;
    getAttribute(selector: string, attributeName: string): Promise<string>;
    getText(selector?: string): Promise<string>;
    isEnabled(selector?: string): Promise<boolean>;
    keys(keys: string): Promise<void>;
    pause(milliseconds: number): Promise<void>;
    waitForEnabled(selector: string, milliseconds?: number, reverse?: boolean): Promise<boolean>;
    waitForExist(
        selector: string,
        milliseconds?: number,
        reverse?: boolean,
        timeoutMsg?: string,
    ): Promise<boolean>;
    waitUntil(
        condition: () => Promise<Boolean>,
        options?: WebDriverIO.WaitUntilOptions,
    ): Promise<boolean>;
}
