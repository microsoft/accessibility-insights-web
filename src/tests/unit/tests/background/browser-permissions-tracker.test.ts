// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { allUrlAndFilePermissions, BrowserPermissionsTracker } from 'background/browser-permissions-tracker';
import { Interpreter } from 'background/interpreter';
import { BrowserAdapter } from 'common/browser-adapters/browser-adapter';
import { Message } from 'common/message';
import { Messages } from 'common/messages';
import { IMock, Mock, Times } from 'typemoq';

describe('BrowserPermissionsTracker', () => {
    let testSubject: BrowserPermissionsTracker;
    let browserAdapterMock: IMock<BrowserAdapter>;
    let interpreterMock: IMock<Interpreter>;

    beforeEach(() => {
        browserAdapterMock = Mock.ofType<BrowserAdapter>();
        interpreterMock = Mock.ofType<Interpreter>();

        testSubject = new BrowserPermissionsTracker(browserAdapterMock.object, interpreterMock.object);
    });

    it.each([true, false])(
        'notifyChange sends the expected interpreter message when browser indicates permissions are %p',
        async browserPermissions => {
            browserAdapterMock
                .setup(adapter => adapter.containsPermissions({ origins: [allUrlAndFilePermissions] }))
                .returns(() => Promise.resolve(browserPermissions))
                .verifiable(Times.once());

            const expectedMessage: Message = {
                messageType: Messages.PermissionsState.PermissionsStateChanged,
                payload: browserPermissions,
                tabId: null,
            };

            await testSubject.notifyChange();

            browserAdapterMock.verifyAll();
            interpreterMock.verify(i => i.interpret(expectedMessage), Times.once());
        },
    );
});
