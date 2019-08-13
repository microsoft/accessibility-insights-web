// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
export class ScanResults {
    private rawData: any;

    constructor(rawData: any) {
        this.rawData = rawData;
    }

    public get deviceName(): string {
        return this.rawData.axeContext.axeDevice.name;
    }

    public get appIdentifier(): string {
        return this.rawData.axeContext.axeMetaData.appIdentifier;
    }
}
