// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { SpectronAsyncClient } from 'tests/electron/common/view-controllers/spectron-async-client';
import { ViewController } from './view-controller';

export class CodecTestViewController extends ViewController {
    constructor(client: SpectronAsyncClient) {
        super(client);
    }

    public async waitForAudioVisible(): Promise<void> {
        await this.waitForSelector('#audio');
    }
}
