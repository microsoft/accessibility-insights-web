// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ConfigAccessor } from 'common/configuration/configuration-types';
import { OSType } from 'electron/window-management/platform-info';
import * as path from 'path';

export function getElectronIconPath(config: ConfigAccessor, os: OSType): string {
    const baseIconPath = config.getOption('electronIconBaseName');
    const iconBaseName = path.join(__dirname, '..', baseIconPath);
    const iconExtension = os === OSType.Windows ? 'ico' : os === OSType.Mac ? 'icns' : 'png';
    return `${iconBaseName}.${iconExtension}`;
}
