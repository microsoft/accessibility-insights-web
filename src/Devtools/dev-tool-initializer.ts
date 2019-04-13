// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import 'reflect-metadata';

import { inject, injectable } from 'inversify';

import { DevToolsChromeAdapter } from '../background/dev-tools-chrome-adapter';
import { StoreProxy } from '../common/store-proxy';
import { StoreNames } from '../common/stores/store-names';
import { DevToolState } from '../common/types/store-data/idev-tool-state';
import { InspectHandler } from './inspect-handler';
import { interfaceNames } from './interface-names';

@injectable()
export class DevToolInitializer {
    protected _chromeAdapter: DevToolsChromeAdapter;

    constructor(@inject(interfaceNames.DevToolsChromeAdapter) chromeAdapter: DevToolsChromeAdapter) {
        this._chromeAdapter = chromeAdapter;
    }

    public initialize(): void {
        const devtoolsStore = new StoreProxy<DevToolState>(StoreNames[StoreNames.DevToolsStore], this._chromeAdapter);
        const inspectHandler = new InspectHandler(devtoolsStore, this._chromeAdapter);

        inspectHandler.initialize();
    }
}
