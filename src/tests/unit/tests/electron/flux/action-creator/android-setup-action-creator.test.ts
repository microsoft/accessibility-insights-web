// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Action } from 'common/flux/action';
import { AndroidSetupActionCreator } from 'electron/flux/action-creator/android-setup-action-creator';
import { AndroidSetupActions } from 'electron/flux/action/android-setup-actions';
import { IMock, Mock, Times } from 'typemoq';

describe(AndroidSetupActionCreator, () => {
    let androidSetupActionsMock: IMock<AndroidSetupActions>;
    let testSubject: AndroidSetupActionCreator;

    beforeEach(() => {
        androidSetupActionsMock = Mock.ofType<AndroidSetupActions>();
        testSubject = new AndroidSetupActionCreator(androidSetupActionsMock.object);
    });

    it('action creator invokes cancel action', () => {
        const actionMock = Mock.ofType<Action<void>>();
        androidSetupActionsMock.setup(actions => actions.cancel).returns(() => actionMock.object);
        actionMock.setup(s => s.invoke()).verifiable(Times.once());

        testSubject.cancel();
        actionMock.verifyAll();
    });
});
