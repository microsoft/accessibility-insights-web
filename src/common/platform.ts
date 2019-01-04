// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { WindowUtils } from './window-utils';

export interface PlatformConfiguration {
    devToolsShortcut: string;
}
const MAC_SHORTCUT = 'Command+Option+I';
const WIN_LINUX_SHORTCUT = 'F12';
export type OSType = 'windows' | 'mac' | 'default';
const platform: { [key in OSType]: PlatformConfiguration } = {
    windows: { devToolsShortcut: WIN_LINUX_SHORTCUT },
    mac: { devToolsShortcut: MAC_SHORTCUT },
    default: { devToolsShortcut: WIN_LINUX_SHORTCUT },
};

export function getPlatform(windowUtils: WindowUtils): PlatformConfiguration {
    const platformKey = windowUtils.getPlatform().toLowerCase();
    if (platformKey.indexOf('win') !== -1) {
        return platform.windows;
    }
    if (platformKey.indexOf('mac') !== -1) {
        return platform.mac;
    }
    return platform.default;
}