// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { isFunction } from 'lodash';
import { IMock, It, Mock, Times } from 'typemoq';

import { BaseActionPayload } from 'background/actions/action-payloads';
import { ShortcutsPageActionCreator } from 'background/actions/shortcuts-page-action-creator';
import { Interpreter } from 'background/interpreter';
import { ShortcutsPageController } from 'background/shortcuts-page-controller';
import { TelemetryEventHandler } from 'background/telemetry/telemetry-event-handler';
import { SHORTCUT_CONFIGURE_OPEN } from '../../../../../common/extension-telemetry-events';
import { Messages } from '../../../../../common/messages';

describe('ShortcutsPageActionCreator', () => {
    let interpreterMock: IMock<Interpreter>;
    let telemetryHandlerMock: IMock<TelemetryEventHandler>;
    let shortcutsPageControllerMock: IMock<ShortcutsPageController>;

    let testSubject: ShortcutsPageActionCreator;

    beforeEach(() => {
        interpreterMock = Mock.ofType<Interpreter>();
        telemetryHandlerMock = Mock.ofType<TelemetryEventHandler>();
        shortcutsPageControllerMock = Mock.ofType<ShortcutsPageController>();

        testSubject = new ShortcutsPageActionCreator(
            interpreterMock.object,
            shortcutsPageControllerMock.object,
            telemetryHandlerMock.object,
        );
    });

    it('handles ConfigureShortcuts', () => {
        const expectedMessage = Messages.Shortcuts.ConfigureShortcuts;

        const payload: BaseActionPayload = {};

        setupInterpreterMock(expectedMessage, payload);

        testSubject.registerCallbacks();

        shortcutsPageControllerMock.verify(controller => controller.openShortcutsTab(), Times.once());
        telemetryHandlerMock.verify(handler => handler.publishTelemetry(SHORTCUT_CONFIGURE_OPEN, payload), Times.once());
    });

    const setupInterpreterMock = <Payload>(expectedMessage: string, payload?: Payload): void => {
        interpreterMock
            .setup(interpreter => interpreter.registerTypeToPayloadCallback(expectedMessage, It.is(isFunction)))
            .callback((message, handler) => {
                if (payload) {
                    handler(payload);
                } else {
                    handler();
                }
            });
    };
});
