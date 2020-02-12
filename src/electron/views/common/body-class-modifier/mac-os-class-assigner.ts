// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ClassAssigner } from 'electron/views/common/body-class-modifier/class-assigner';
import { PlatformInfo } from 'electron/window-management/platform-info';

export const IsMacOsClassName = 'is-mac-os';

export class MacOsClassAssigner implements ClassAssigner {
    constructor(private readonly platformInfo: PlatformInfo) {}

    public assign(): string {
        if (this.platformInfo.isMac()) {
            return IsMacOsClassName;
        }

        return null;
    }
}
