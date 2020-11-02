// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { SpectronClient, SpectronWindow } from 'spectron';
import * as WebDriverIO from 'webdriverio';

// This file worked around incorrect or missing spectron/webdriverio
// typings in the past. These types are improved in spectron 12.0.0,
// so this file is now just a single place to update the usages. We
// can remove this extra layer by updating individual end-to-end
// tests/controllers to consume SpectronClient directly.

export function getSpectronAsyncClient(client: SpectronClient, browserWindow: SpectronWindow) {
    const typedAsyncClient: SpectronAsyncClient = {
        browserWindow,
        $: (selector: string) => client.$(selector),
        $$: (selector: string) => client.$$(selector),
        click: async (selector: string) => {
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
    return typedAsyncClient;
}

export interface SpectronAsyncClient {
    browserWindow: SpectronWindow;
    $(selector: string): Promise<WebDriverIO.Element>;
    $$(selector: string): Promise<WebDriverIO.Element[]>;
    click(selector: string): Promise<void>;
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
