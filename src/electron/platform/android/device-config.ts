// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

export class DeviceConfig {
    constructor(readonly rawData: any) {}

    public get deviceName(): string {
        try {
            return this.rawData.deviceName;
        } catch {
            return null;
        }
    }

    public get appIdentifier(): string {
        try {
            return this.rawData.packageName;
        } catch {
            return null;
        }
    }
}
