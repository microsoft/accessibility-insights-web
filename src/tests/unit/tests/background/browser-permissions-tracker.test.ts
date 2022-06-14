// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { SetAllUrlsPermissionStatePayload } from 'background/actions/action-payloads';
import {
    allUrlAndFilePermissions,
    BrowserPermissionsTracker,
    permissionsCheckErrorMessage,
} from 'background/browser-permissions-tracker';
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

        interpreterMock
            .setup(i => i.interpret(It.isAny()))
            .returns(() => ({
                messageHandled: true,
                result: undefined,
            }));

        testSubject = new BrowserPermissionsTracker(
            browserAdapterMock.object,
            interpreterMock.object,
            loggerMock.object,
        );
    });

    describe('initialize', () => {
        it('registers the expected listeners', async () => {
            await testSubject.initialize();

            browserAdapterMock.verify(
                adapter => adapter.addListenerOnPermissionsAdded(It.is(isFunction)),
                Times.once(),
            );
            browserAdapterMock.verify(
                adapter => adapter.addListenerOnPermissionsRemoved(It.is(isFunction)),
                Times.once(),
            );
        });
    });

    describe('onPermissionsAdded', () => {
        it.each([true, false])(
            'sends the expected interpreter message when browser indicates permissions are "%p"',
            async browserPermissions => {
                await testSubject.initialize();

                setupBrowserAdapterMock(Promise.resolve(browserPermissions));

                await browserAdapterMock.addPermissions();

                verifyInterpreterMessage(browserPermissions);
                loggerMock.verify(logger => logger.log(It.isAny()), Times.never());
            },
        );

        it('sends the message with permissions as "false" when an exception occurs', async () => {
            const browserPermissions = false;
            await testSubject.initialize();

            setupBrowserAdapterMock(Promise.reject());

            await browserAdapterMock.addPermissions();

            verifyInterpreterMessage(browserPermissions);
            loggerMock.verify(logger => logger.log(permissionsCheckErrorMessage), Times.once());
        });
    });

    describe('onPermissionsRemoved', () => {
        it.each([true, false])(
            'sends the expected interpreter message when browser indicates permissions are %p',
            async browserPermissions => {
                await testSubject.initialize();

                setupBrowserAdapterMock(Promise.resolve(browserPermissions));

                await browserAdapterMock.removePermissions();

                verifyInterpreterMessage(browserPermissions);
                loggerMock.verify(logger => logger.log(It.isAny()), Times.never());
            },
        );

        it('sends the message with permissions as "false" when an exception occurs', async () => {
            const browserPermissions = false;
            await testSubject.initialize();

            setupBrowserAdapterMock(Promise.reject());

            await browserAdapterMock.removePermissions();

            verifyInterpreterMessage(browserPermissions);
            loggerMock.verify(logger => logger.log(permissionsCheckErrorMessage), Times.once());
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
        mock.setup(adapter => adapter.addListenerOnPermissionsRemoved(It.is(isFunction))).callback(
            c => (mock.notifyOnPermissionsRemoved = c),
        );

        mock.addPermissions = async () => {
            await mock.notifyOnPermissionsAdded();
        };
        mock.removePermissions = async () => {
            await mock.notifyOnPermissionsRemoved();
        };

        return mock as SimulatedBrowserAdapter;
    }

    function setupBrowserAdapterMock(result: Promise<boolean>): void {
        browserAdapterMock
            .setup(adapter => adapter.containsPermissions(allUrlAndFilePermissions))
            .returns(() => result)
            .verifiable(Times.once());
    }

    function verifyInterpreterMessage(browserPermissions: boolean): void {
        const expectedMessage: Message = {
            messageType: Messages.PermissionsState.SetPermissionsState,
            payload: {
                hasAllUrlAndFilePermissions: browserPermissions,
            } as SetAllUrlsPermissionStatePayload,
        };

        interpreterMock.verify(interpreter => interpreter.interpret(expectedMessage), Times.once());
    }
});
