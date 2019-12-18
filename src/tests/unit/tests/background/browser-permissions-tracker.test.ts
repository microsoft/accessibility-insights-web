// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { allUrlAndFilePermissions, BrowserPermissionsTracker } from 'background/browser-permissions-tracker';
import { Interpreter } from 'background/interpreter';
import { BrowserAdapter } from 'common/browser-adapters/browser-adapter';
import { Logger } from 'common/logging/logger';
import { Message } from 'common/message';
import { Messages } from 'common/messages';
import { isFunction } from 'lodash';
import { IMock, It, Mock, Times } from 'typemoq';

describe('BrowserPermissionsTracker', () => {
    let testSubject: BrowserPermissionsTracker;
    let browserAdapterMock: SimulatedBrowserAdapter;
    let interpreterMock: IMock<Interpreter>;
    let loggerMock: IMock<Logger>;

    beforeEach(() => {
        interpreterMock = Mock.ofType<Interpreter>();
        loggerMock = Mock.ofType<Logger>();
        browserAdapterMock = createBrowserAdapterMock();

        testSubject = new BrowserPermissionsTracker(browserAdapterMock.object, interpreterMock.object, loggerMock.object);
    });

    describe('initialize', () => {
        it('registers the expected listeners', async () => {
            await testSubject.initialize();

            browserAdapterMock.verify(m => m.addListenerOnPermissionsAdded(It.is(isFunction)), Times.once());
            browserAdapterMock.verify(m => m.addListenerOnPermissionsRemoved(It.is(isFunction)), Times.once());
        });
    });

    describe('onPermissionsAdded', () => {
        it.each([true, false])(
            'sends the expected interpreter message when browser indicates permissions are "%p"',
            async browserPermissions => {
                await testSubject.initialize();

                browserAdapterMock
                    .setup(adapter => adapter.containsPermissions(allUrlAndFilePermissions))
                    .returns(() => Promise.resolve(browserPermissions))
                    .verifiable(Times.once());

                await browserAdapterMock.addPermissions();

                const expectedMessage: Message = {
                    messageType: Messages.PermissionsState.SetPermissionsState,
                    payload: browserPermissions,
                    tabId: null,
                };

                interpreterMock.verify(i => i.interpret(expectedMessage), Times.once());
                loggerMock.verify(logger => logger.log(It.isAny()), Times.never());
            },
        );

        it('sends the message with permissions as "false" when an exception occurs', async () => {
            const hasAllUrlAndFilePermissions = false;
            await testSubject.initialize();

            browserAdapterMock
                .setup(adapter => adapter.containsPermissions(allUrlAndFilePermissions))
                .returns(() => Promise.reject())
                .verifiable(Times.once());

            await browserAdapterMock.addPermissions();

            const expectedMessage: Message = {
                messageType: Messages.PermissionsState.SetPermissionsState,
                payload: hasAllUrlAndFilePermissions,
                tabId: null,
            };

            interpreterMock.verify(i => i.interpret(expectedMessage), Times.once());
            loggerMock.verify(logger => logger.log('Error occurred while checking browser permissions'), Times.once());
        });
    });

    describe('onPermissionsRemoved', () => {
        it.each([true, false])(
            'sends the expected interpreter message when browser indicates permissions are %p',
            async browserPermissions => {
                await testSubject.initialize();

                browserAdapterMock
                    .setup(adapter => adapter.containsPermissions(allUrlAndFilePermissions))
                    .returns(() => Promise.resolve(browserPermissions))
                    .verifiable(Times.once());

                await browserAdapterMock.removePermissions();

                const expectedMessage: Message = {
                    messageType: Messages.PermissionsState.SetPermissionsState,
                    payload: browserPermissions,
                    tabId: null,
                };

                interpreterMock.verify(i => i.interpret(expectedMessage), Times.once());
                loggerMock.verify(logger => logger.log(It.isAny()), Times.never());
            },
        );

        it('sends the message with permissions as "false" when an exception occurs', async () => {
            const hasAllUrlAndFilePermissions = false;
            await testSubject.initialize();

            browserAdapterMock
                .setup(adapter => adapter.containsPermissions(allUrlAndFilePermissions))
                .returns(() => Promise.reject())
                .verifiable(Times.once());

            await browserAdapterMock.removePermissions();

            const expectedMessage: Message = {
                messageType: Messages.PermissionsState.SetPermissionsState,
                payload: hasAllUrlAndFilePermissions,
                tabId: null,
            };

            interpreterMock.verify(i => i.interpret(expectedMessage), Times.once());
            loggerMock.verify(logger => logger.log('Error occurred while checking browser permissions'), Times.once());
        });
    });

    type SimulatedBrowserAdapter = IMock<BrowserAdapter> & {
        notifyOnPermissionsAdded?: () => Promise<void>;
        notifyOnPermissionsRemoved?: () => Promise<void>;

        addPermissions: () => Promise<void>;
        removePermissions: () => Promise<void>;
    };

    function createBrowserAdapterMock(): SimulatedBrowserAdapter {
        const mock: Partial<SimulatedBrowserAdapter> = Mock.ofType<BrowserAdapter>();
        mock.setup(m => m.addListenerOnPermissionsAdded(It.is(isFunction))).callback(c => {
            mock.notifyOnPermissionsAdded = c;
        });
        mock.setup(m => m.addListenerOnPermissionsRemoved(It.is(isFunction))).callback(c => (mock.notifyOnPermissionsRemoved = c));

        mock.addPermissions = async () => {
            await mock.notifyOnPermissionsAdded();
        };
        mock.removePermissions = async () => {
            await mock.notifyOnPermissionsRemoved();
        };

        return mock as SimulatedBrowserAdapter;
    }
});
