// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Interpreter } from 'background/interpreter';
import { PermissionsStateTracker } from 'background/permissions-state-tracker';
import { BrowserAdapter } from 'common/browser-adapters/browser-adapter';
import { Message } from 'common/message';
import { Messages } from 'common/messages';
import { tick } from 'tests/unit/common/tick';
import { IMock, It, Mock, Times } from 'typemoq';

describe('PermissionsStateTracker', () => {
    let testSubject: PermissionsStateTracker;
    let browserAdapterMock: IMock<BrowserAdapter>;
    let interpreterMock: IMock<Interpreter>;

    beforeEach(() => {
        browserAdapterMock = Mock.ofType<BrowserAdapter>();
        interpreterMock = Mock.ofType<Interpreter>();

        testSubject = new PermissionsStateTracker(browserAdapterMock.object, interpreterMock.object);
    });

    it.each([true, false])('notifyChange sends the expected interpreter message', async permissionsState => {
        browserAdapterMock
            .setup(adapter => adapter.containsPermissions(It.isAny()))
            .returns(() => Promise.resolve(permissionsState))
            .verifiable(Times.once());

        const expectedMessage: Message = {
            messageType: Messages.PermissionsState.PermissionsStateChanged,
            payload: permissionsState,
            tabId: null,
        };

        testSubject.notifyChange();

        await tick();

        browserAdapterMock.verifyAll();
        interpreterMock.verify(i => i.interpret(expectedMessage), Times.once());
    });
});
