// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';

import { SetTelemetryStatePayload } from '../../../../background/actions/action-payloads';
import { UserConfigMessageCreator } from '../../../../common/message-creators/user-config-message-creator';
import { Messages } from '../../../../common/messages';

describe('UserConfigMessageCreatorTest', () => {
    let postMessageMock: IMock<(message) => void>;
    let testSubject: UserConfigMessageCreator;
    let tabId: number;

    beforeEach(() => {

        postMessageMock = Mock.ofInstance(message => { }, MockBehavior.Strict);
        tabId = 1;

        testSubject = new UserConfigMessageCreator(postMessageMock.object, tabId);
    });

    afterEach(() => {
        postMessageMock.verifyAll();
    });

    test('SetTelemetryState', () => {
        const enableTelemetry = false;
        const payload: SetTelemetryStatePayload = {
            enableTelemetry,
        };
        const expectedMessage = {
            tabId: 1,
            type: Messages.UserConfig.SetUserConfig,
            payload,
        };

        postMessageMock
            .setup(pm => pm(It.isValue(expectedMessage)))
            .verifiable(Times.once());

        testSubject.setTelemetryState(enableTelemetry);

        postMessageMock.verifyAll();
    });
});
