// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

export enum OSType {
    Windows,
    Linux,
    Mac,
}
export class PlatformInfo {
    constructor(private readonly currentProcess: NodeJS.Process) {}

    public getOs(): OSType | null {
        if (this.currentProcess.platform === 'win32') {
            return OSType.Windows;
        } else if (this.currentProcess.platform === 'linux') {
            return OSType.Linux;
        } else if (this.currentProcess.platform === 'darwin') {
            return OSType.Mac;
        }

        return null;
    }

    public isMac(): boolean {
        return this.getOs() === OSType.Mac;
    }

    public isLinux(): boolean {
        return this.getOs() === OSType.Linux;
    }

    public getOsName(): string {
        return this.currentProcess.platform || null;
    }
}
