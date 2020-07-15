// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AppDataAdapter } from 'common/browser-adapters/app-data-adapter';
import { ConfigAccessor } from 'common/configuration/configuration-types';

export class ElectronAppDataAdapter implements AppDataAdapter {
    public constructor(private readonly config: ConfigAccessor) {}

    public getVersion = (): string => {
        return this.config.getOption('unifiedAppVersion') ?? 'app version not found';
    };
}
