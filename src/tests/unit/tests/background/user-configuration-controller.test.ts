// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { SaveWindowBoundsPayload } from 'background/actions/action-payloads';
import { Interpreter } from 'background/interpreter';
import { UserConfigurationController } from 'background/user-configuration-controller';
import { Message } from 'common/message';
import { Messages } from 'common/messages';
import { IMock, Mock, Times } from 'typemoq';

describe('UserConfigurationController', () => {
    let testSubject: UserConfigurationController;
    let interpreterMock: IMock<Interpreter>;

    beforeEach(() => {
        interpreterMock = Mock.ofType<Interpreter>();
        testSubject = new UserConfigurationController(interpreterMock.object);
    });

    it.each([true, false])(
        'setHighContrastMode(%s) sends the expected interpreter message',
        (enabled: boolean) => {
            const expectedMessage: Message = {
                messageType: Messages.UserConfig.SetHighContrastConfig,
                payload: { enableHighContrast: enabled },
                tabId: null,
            };
            testSubject.setHighContrastMode(enabled);
            interpreterMock.verify(i => i.interpret(expectedMessage), Times.once());
        },
    );

    it.each([true, false])(
        'setTelemetryState(%s) sends the expected interpreter message',
        (enabled: boolean) => {
            const expectedMessage: Message = {
                messageType: Messages.UserConfig.SetTelemetryConfig,
                payload: { enableTelemetry: enabled },
                tabId: null,
            };
            testSubject.setTelemetryState(enabled);
            interpreterMock.verify(i => i.interpret(expectedMessage), Times.once());
        },
    );

    it('saveWindowBounds sends the expected interpreter message', () => {
        const payload: SaveWindowBoundsPayload = {
            windowState: 'maximized',
            windowBounds: { x: 1, y: 2, width: 10, height: 20 },
        };

        const expectedMessage: Message = {
            messageType: Messages.UserConfig.SaveWindowBounds,
            payload: payload,
        };
        testSubject.saveWindowBounds(payload);
        interpreterMock.verify(i => i.interpret(expectedMessage), Times.once());
    });
});
