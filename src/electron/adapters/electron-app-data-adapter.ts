// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AppDataAdapter } from 'common/browser-adapters/app-data-adapter';
import { IpcRendererShim } from 'electron/ipc/ipc-renderer-shim';

export class ElectronAppDataAdapter implements AppDataAdapter {
    public constructor(private readonly ipcRendererShim: IpcRendererShim) {}

    public getVersion(): string {
        return this.ipcRendererShim.getVersion();
    }
}
