// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
export class ScanResults {
    private rawData: any;

    constructor(rawData: any) {
        this.rawData = rawData;
    }

    public get deviceName(): string {
        try {
            return this.rawData.axeContext.axeDevice.name;
        } catch {
            return null;
        }
    }

    public get appIdentifier(): string {
        try {
            return this.rawData.axeContext.axeMetaData.appIdentifier;
        } catch {
            return null;
        }
    }
}
