// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import path from 'path';
import { ConfigAccessor } from 'common/configuration/configuration-types';
import { OSType } from 'electron/window-management/platform-info';

export function getElectronIconPath(
    config: ConfigAccessor,
    os: OSType | null,
    pathObj: typeof path = path,
): string | undefined {
    const baseIconPath = config.getOption('electronIconBaseName');
    if (baseIconPath === undefined) {
        return undefined;
    }

    const iconBaseName = pathObj.join(__dirname, '..', baseIconPath);
    const iconExtension = os === OSType.Windows ? 'ico' : os === OSType.Mac ? 'icns' : 'png';
    return `${iconBaseName}.${iconExtension}`;
}
