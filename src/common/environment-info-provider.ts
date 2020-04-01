// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { toolName } from '../content/strings/application';
import { ToolData } from './types/store-data/unified-data-interface';

export type EnvironmentInfo = {
    extensionVersion: string;
    browserSpec: string;
    axeCoreVersion: string;
};

export class EnvironmentInfoProvider {
    constructor(
        private extensionVersion: string,
        private browserSpec: string,
        private axeVersion: string,
    ) {}
    public getEnvironmentInfo(): EnvironmentInfo {
        return {
            extensionVersion: this.extensionVersion,
            browserSpec: this.browserSpec,
            axeCoreVersion: this.axeVersion,
        };
    }

    public getToolData(): ToolData {
        return {
            scanEngineProperties: {
                name: 'axe-core',
                version: this.axeVersion,
            },
            applicationProperties: {
                name: toolName,
                version: this.extensionVersion,
            },
        };
    }
}
