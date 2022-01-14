// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BaseActionPayload } from 'background/actions/action-payloads';
import { ShortcutsPageActionCreator } from 'background/actions/shortcuts-page-action-creator';
import { Interpreter } from 'background/interpreter';
import { ShortcutsPageController } from 'background/shortcuts-page-controller';
import { TelemetryEventHandler } from 'background/telemetry/telemetry-event-handler';
import { SHORTCUT_CONFIGURE_OPEN } from 'common/extension-telemetry-events';
import { Logger } from 'common/logging/logger';
import { Messages } from 'common/messages';
import { isFunction } from 'lodash';
import { flushResolvedPromises } from 'tests/common/flush-resolved-promises';
import { IMock, It, Mock, Times } from 'typemoq';

describe('ShortcutsPageActionCreator', () => {
    let interpreterMock: IMock<Interpreter>;
    let telemetryHandlerMock: IMock<TelemetryEventHandler>;
    let shortcutsPageControllerMock: IMock<ShortcutsPageController>;
    let loggerMock: IMock<Logger>;

    let testSubject: ShortcutsPageActionCreator;

    const expectedMessage = Messages.Shortcuts.ConfigureShortcuts;

    const payload: BaseActionPayload = {};

    beforeEach(() => {
        interpreterMock = Mock.ofType<Interpreter>();

        interpreterMock
            .setup(interpreter =>
                interpreter.registerTypeToPayloadCallback(expectedMessage, It.is(isFunction)),
            )
            .callback((message, handler) => {
                handler(payload);
            });

        telemetryHandlerMock = Mock.ofType<TelemetryEventHandler>();
        shortcutsPageControllerMock = Mock.ofType<ShortcutsPageController>();
        loggerMock = Mock.ofType<Logger>();

        testSubject = new ShortcutsPageActionCreator(
            interpreterMock.object,
            shortcutsPageControllerMock.object,
            telemetryHandlerMock.object,
            loggerMock.object,
        );
    });

    describe('handles ConfigureShortcuts message', () => {
        it('opens the shortcuts tab', async () => {
            shortcutsPageControllerMock
                .setup(controller => controller.openShortcutsTab())
                .returns(() => Promise.resolve());

            testSubject.registerCallbacks();

            await flushResolvedPromises();

            shortcutsPageControllerMock.verify(
                controller => controller.openShortcutsTab(),
                Times.once(),
            );
        });

        describe('sends telemetry', () => {
            it('when opening shortcuts tab succeeds', async () => {
                shortcutsPageControllerMock
                    .setup(controller => controller.openShortcutsTab())
                    .returns(() => Promise.resolve());

                testSubject.registerCallbacks();

                await flushResolvedPromises();

                telemetryHandlerMock.verify(
                    handler => handler.publishTelemetry(SHORTCUT_CONFIGURE_OPEN, payload),
                    Times.once(),
                );
            });

            it('when opening shortcuts tab fails', async () => {
                const errorMessage = 'dummy error';
                shortcutsPageControllerMock
                    .setup(controller => controller.openShortcutsTab())
                    .returns(() => Promise.reject(errorMessage));

                testSubject.registerCallbacks();

                await flushResolvedPromises();

                telemetryHandlerMock.verify(
                    handler => handler.publishTelemetry(SHORTCUT_CONFIGURE_OPEN, payload),
                    Times.once(),
                );
                loggerMock.verify(logger => logger.error(errorMessage), Times.once());
            });
        });
    });
});
