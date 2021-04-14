// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as path from 'path';
import { ConfigAccessor } from 'common/configuration/configuration-types';
import { OSType } from 'electron/window-management/platform-info';

export function getElectronIconPath(config: ConfigAccessor, os: OSType | null): string | undefined {
    const baseIconPath = config.getOption('electronIconBaseName');
    if (baseIconPath === undefined) {
        return undefined;
    }

    const iconBaseName = path.join(__dirname, '..', baseIconPath);
    const iconExtension = os === OSType.Windows ? 'ico' : os === OSType.Mac ? 'icns' : 'png';
    return `${iconBaseName}.${iconExtension}`;
}
