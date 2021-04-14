// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import {
    createDeviceFocusCommandSender,
    DeviceFocusCommand,
    DeviceFocusCommandSender,
    HttpGet,
} from 'electron/platform/android/device-focus-command-sender';
import { IMock, Mock, MockBehavior, Times } from 'typemoq';

describe('DeviceFocusCommandSender tests', () => {
    let httpGetMock: IMock<HttpGet>;
    let testSubject: DeviceFocusCommandSender;

    const port = 12345;

    beforeEach(() => {
        httpGetMock = Mock.ofType<HttpGet>(undefined, MockBehavior.Strict);
        testSubject = createDeviceFocusCommandSender(httpGetMock.object);
    });

    it('propagates errors properly', async () => {
        const reason = 'Something went wrong';

        httpGetMock
            .setup(getter =>
                getter('http://localhost:12345/AccessibilityInsights/FocusTracking/Enable'),
            )
            .returns(() => Promise.reject(reason));

        await expect(testSubject(port, DeviceFocusCommand.Enable)).rejects.toMatch(reason);
    });

    describe('send commands, get no error', () => {
        test.each([
            DeviceFocusCommand.Enable,
            DeviceFocusCommand.Disable,
            DeviceFocusCommand.Reset,
        ])('sending command: %p', async (command: DeviceFocusCommand) => {
            httpGetMock
                .setup(getter =>
                    getter('http://localhost:12345/AccessibilityInsights/FocusTracking/' + command),
                )
                .verifiable(Times.once());

            await testSubject(port, command);

            httpGetMock.verifyAll();
        });
    });
});
