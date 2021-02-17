// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { buildKeyboardButtonAutomationId } from 'electron/views/virtual-keyboard/virtual-keyboard-buttons';
import { getAutomationIdSelector } from 'tests/common/get-automation-id-selector';
import { SpectronAsyncClient } from 'tests/electron/common/view-controllers/spectron-async-client';
import { ViewController } from './view-controller';

export type VirtualKeyType = 'Up' | 'Down' | 'Left' | 'Right' | 'Enter' | 'Tab';

export class VirtualKeyboardViewController extends ViewController {
    constructor(client: SpectronAsyncClient) {
        super(client);
    }

    public async clickVirtualKey(virtualKey: VirtualKeyType): Promise<void> {
        const automationId = buildKeyboardButtonAutomationId(virtualKey);
        const selector = getAutomationIdSelector(automationId);

        await this.waitForSelector(selector);
        await this.client.click(selector);
    }
}
