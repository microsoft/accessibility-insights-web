// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
declare module 'webdriverio' {
    interface ElementController {
        keys(keys: string): Promise<void>;
        getAttribute(attributeName: string): Promise<string>;
        getText(selector?: string): Promise<string>;
        value: any;
    }

    interface Client {
        // element(selector: string): Promise<ElementController>;
        $(selector: string): Promise<ElementController>;
        $$(selector: string): Promise<ElementController[]>;
        pause(milliseconds: number): Promise<void>;
        click(selector?: string): Promise<void>;
        executeAsync(script: string | ((...args: any[]) => void), ...args: any[]): Promise<any>;
        execute(script: string | ((...args: any[]) => void), ...args: any[]): Promise<any>;
        waitForEnabled(
            selector: string,
            milliseconds?: number,
            reverse?: boolean,
        ): Promise<boolean>;
    }
}
