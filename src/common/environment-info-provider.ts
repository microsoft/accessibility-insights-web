// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
export type EnvironmentInfo = {
    extensionVersion: string;
    browserSpec: string;
    axeCoreVersion: string;
};

export class EnvironmentInfoProvider {
    constructor(private extensionVersion: string, private browserSpec: string, private axeVersion: string) {}
    public getEnvironmentInfo(): EnvironmentInfo {
        return {
            extensionVersion: this.extensionVersion,
            browserSpec: this.browserSpec,
            axeCoreVersion: this.axeVersion,
        };
    }
}
