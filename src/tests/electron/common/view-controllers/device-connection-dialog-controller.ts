// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { SpectronAsyncClient } from 'tests/electron/common/view-controllers/spectron-async-client';
import { CommonSelectors } from '../element-identifiers/common-selectors';
import { ViewController } from './view-controller';

export class DeviceConnectionDialogController extends ViewController {
    constructor(client: SpectronAsyncClient) {
        super(client);
    }

    public async waitForDialogVisible(): Promise<void> {
        await this.waitForSelector(CommonSelectors.rootContainer);
    }
}
