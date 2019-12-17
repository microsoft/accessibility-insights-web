// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { allUrlAndFilePermissions, BrowserPermissionsTracker } from 'background/browser-permissions-tracker';
import { Interpreter } from 'background/interpreter';
import { BrowserAdapter } from 'common/browser-adapters/browser-adapter';
import { Message } from 'common/message';
import { Messages } from 'common/messages';
import { isFunction } from 'lodash';
import { IMock, It, Mock, Times } from 'typemoq';

describe('BrowserPermissionsTracker', () => {
    let testSubject: BrowserPermissionsTracker;
    let browserAdapterMock: IMock<BrowserAdapter>;
    let interpreterMock: IMock<Interpreter>;

    beforeEach(() => {
        interpreterMock = Mock.ofType<Interpreter>();
        browserAdapterMock = createBrowserAdapterMock();

        testSubject = new BrowserPermissionsTracker(browserAdapterMock.object, interpreterMock.object);
    });

    describe('initialize', () => {
        it('should register the expected listeners', async () => {
            await testSubject.initialize();

            browserAdapterMock.verify(m => m.addListenerOnPermissionsAdded(It.is(isFunction)), Times.once());
            browserAdapterMock.verify(m => m.addListenerOnPermissionsRemoved(It.is(isFunction)), Times.once());
        });
    });

    it.skip.each([true, false])(
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

            // await testSubject.notifyChange();

            browserAdapterMock.verifyAll();
            interpreterMock.verify(i => i.interpret(expectedMessage), Times.once());
        },
    );

    type SimulatedBrowserAdapter = IMock<BrowserAdapter> & {
        notifyChange: () => Promise<void>;
    };

    function createBrowserAdapterMock(): SimulatedBrowserAdapter {
        const mock: Partial<SimulatedBrowserAdapter> = Mock.ofType<BrowserAdapter>();
        mock.setup(m => m.addListenerOnPermissionsAdded(It.is(isFunction))).callback(c => (mock.notifyChange = c));
        mock.setup(m => m.addListenerOnPermissionsRemoved(It.is(isFunction))).callback(c => (mock.notifyChange = c));

        return mock as SimulatedBrowserAdapter;
    }
});
