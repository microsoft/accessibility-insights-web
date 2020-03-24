// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
export class DeviceConfig {
    constructor(readonly rawData: any) {}

    public get deviceName(): string {
        return this.rawData?.deviceName || null;
    }

    public get appIdentifier(): string {
        return this.rawData?.packageName || null;
    }
}
