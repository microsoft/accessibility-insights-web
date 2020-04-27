// Copyright (c) Microsoft Corporation. All rights reserved.

import { RawResult } from 'webdriverio';

// Licensed under the MIT License.
declare module 'webdriverio' {
    interface ElementController {
        value: any;
    }

    interface Client {
        $(selector: string): Promise<RawResult>;
        $$(selector: string): Promise<RawResult[]>;
        pause(milliseconds: number): Promise<void>;
        click(selector?: string): Promise<void>;
        keys(keys: string): Promise<void>;
        executeAsync(script: string | ((...args: any[]) => void), ...args: any[]): Promise<any>;
        execute(script: string | ((...args: any[]) => void), ...args: any[]): Promise<any>;
        waitForEnabled(
            selector: string,
            milliseconds?: number,
            reverse?: boolean,
        ): Promise<boolean>;

        getText(selector?: string): Promise<string>;
        getAttribute(selector: string, attributeName: string): Promise<string>;
    }
}
