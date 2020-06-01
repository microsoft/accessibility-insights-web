// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Action } from 'common/flux/action';
import { AndroidSetupActionCreator } from 'electron/flux/action-creator/android-setup-action-creator';
import { AndroidSetupActions } from 'electron/flux/action/android-setup-actions';
import { NextStepPayload } from 'electron/flux/action/android-setup-payloads';
import { IMock, Mock, Times } from 'typemoq';

describe(AndroidSetupActionCreator, () => {
    let androidSetupActionsMock: IMock<AndroidSetupActions>;
    let testSubject: AndroidSetupActionCreator;

    beforeEach(() => {
        androidSetupActionsMock = Mock.ofType<AndroidSetupActions>();
        testSubject = new AndroidSetupActionCreator(androidSetupActionsMock.object);
    });

    it('calling next invokes next action with given payload', () => {
        const nextActionMock = Mock.ofType<Action<NextStepPayload>>();
        const testPayload: NextStepPayload = {
            step: 'detect-permissions',
        };
        androidSetupActionsMock.setup(actions => actions.next).returns(() => nextActionMock.object);
        nextActionMock.setup(s => s.invoke(testPayload)).verifiable(Times.once());

        testSubject.next(testPayload);
        nextActionMock.verifyAll();
    });
});
