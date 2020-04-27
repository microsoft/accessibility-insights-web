// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { RawResult } from 'webdriverio';

// spectron 10.0.1 includes @types/webdriverio, whose absence
// we worked around when initially consuming spectron.
// @types/webdriver lacks promises, so this file adds
// promise-based signatures that our e2e code can rely on.
// @types/webdriver has been superceded by improved types
// in webdriverio 5 directly, but Spectron has not consumed them

declare module 'webdriverio' {
    interface Client {
        $(selector: string): Promise<RawResult>;
        $$(selector: string): Promise<RawResult[]>;
        click(selector?: string): Promise<void>;
        executeAsync(script: string | ((...args: any[]) => void), ...args: any[]): Promise<any>;
        execute(script: string | ((...args: any[]) => void), ...args: any[]): Promise<any>;
        getAttribute(selector: string, attributeName: string): Promise<string>;
        getText(selector?: string): Promise<string>;
        keys(keys: string): Promise<void>;
        pause(milliseconds: number): Promise<void>;
        waitForEnabled(
            selector: string,
            milliseconds?: number,
            reverse?: boolean,
        ): Promise<boolean>;
    }
}
