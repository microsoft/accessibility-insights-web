// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

export enum OSType {
    Unsupported,
    Windows,
    Linux,
    Mac,
}

export class PlatformInfo {
    constructor(private readonly currentProcess: NodeJS.Process) {}

    public getOs(): OSType {
        switch (this.currentProcess.platform) {
            case 'win32':
                return OSType.Windows;
            case 'linux':
                return OSType.Linux;
            case 'darwin':
                return OSType.Mac;
            case 'aix':
            case 'android':
            case 'cygwin':
            case 'freebsd':
            case 'netbsd':
            case 'openbsd':
            case 'sunos':
                return OSType.Unsupported;
            default:
                this.onUnsupportedOS(this.currentProcess.platform);
        }
    }

    // The following function ensures  exhaustiveness checking where it is used in a switch statement
    // See https://www.typescriptlang.org/docs/handbook/advanced-types.html#exhaustiveness-checking
    private onUnsupportedOS(platform: never): never {
        throw Error(`Unexpected OS: ${platform}`);
    }

    public isMac(): boolean {
        return this.getOs() === OSType.Mac;
    }

    public getOsName(): string {
        return this.currentProcess.platform || null;
    }
}
