// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { AdbWrapper } from 'electron/platform/android/adb-wrapper';

export class AdbWrapperHolder {
    private adbWrapper: AdbWrapper;

    public getAdb(): AdbWrapper {
        return this.adbWrapper;
    }

    public setAdb(adbWrapper: AdbWrapper): void {
        this.adbWrapper = adbWrapper;
    }
}
