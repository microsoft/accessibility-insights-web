// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ConfigAccessor } from 'common/configuration/configuration-types';
import { OSType } from 'electron/window-management/platform-info';
import * as path from 'path';

export function getElectronIconPath(config: ConfigAccessor, os: OSType): string | null {
    const baseIconPath = config.getOption('electronIconBaseName');
    if (baseIconPath == null) {
        console.log(
            "The function getElectronIconPath received an undefined value for the option 'electronIconBaseName'",
        );
        return null;
    }

    const iconBaseName = path.join(__dirname, '..', baseIconPath);
    const iconExtension = os === OSType.Windows ? 'ico' : os === OSType.Mac ? 'icns' : 'png';
    return `${iconBaseName}.${iconExtension}`;
}
