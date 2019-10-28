// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AppDataAdapter } from 'common/browser-adapters/app-data-adapter';
import { remote } from 'electron';

export class ElectronAppDataAdapter implements AppDataAdapter {
    public getVersion(): string {
        return remote.app.getVersion();
    }
}
