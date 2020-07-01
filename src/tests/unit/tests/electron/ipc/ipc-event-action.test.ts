// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IpcEventAction } from 'electron/ipc/ipc-event-action';
import { Mock, Times } from 'typemoq';

describe('IpcEventAction', () => {
    it('invokeAsync calls listeners when added', async () => {
        const testSubject = new IpcEventAction();
        const listenerMocks = [];
        for (let i = 0; i <= 3; i++) {
            listenerMocks.push(Mock.ofInstance(async () => {}));
            testSubject.addAsyncListener(listenerMocks[i].object);
        }
        await testSubject.invokeAsync();

        for (const mock of listenerMocks) {
            mock.verify(m => m(), Times.once());
        }
    });
});
