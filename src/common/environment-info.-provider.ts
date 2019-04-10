// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BrowserAdapter } from './../background/browser-adapter';
import { AxeInfo } from './axe-info';

export type EnvironmentInfo = {
    extensionVersion: string;
    browserSpec: string;
    axeCoreVersion: string;
};

export class EnvironmentInfoProvider {
    constructor(private browserAdapter: BrowserAdapter, private browserSpec: string) {}
    public get(): EnvironmentInfo {
        return {
            extensionVersion: this.browserAdapter.extensionVersion,
            browserSpec: this.browserSpec,
            axeCoreVersion: AxeInfo.Default.version,
        };
    }
}
