// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BrowserAdapter } from 'common/browser-adapters/browser-adapter';
import { InterpreterMessage } from 'common/message';
import { IMock, Mock, MockBehavior, Times } from 'typemoq';

export class DevToolsBrowserAdapterMock {
    private underlyingMock: IMock<BrowserAdapter> = Mock.ofType<BrowserAdapter>(
        undefined,
        MockBehavior.Strict,
    );

    public setupGetInspectedWindowTabId(tabId: number): void {
        this.underlyingMock
            .setup(x => x.getInspectedWindowTabId())
            .returns(() => tabId)
            .verifiable(Times.once());
    }

    public setupSendMessageToFrames(message: InterpreterMessage): void {
        this.underlyingMock.setup(x => x.sendMessageToFrames(message)).verifiable(Times.once());
    }

    public verifyAll(): void {
        this.underlyingMock.verifyAll();
    }

    public getObject(): BrowserAdapter {
        return this.underlyingMock.object;
    }
}
