// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Action } from 'common/flux/action';
import { IMock, Mock, Times } from 'typemoq';

describe('ActionTest', () => {
    let listenerMock: IMock<(payload: TestPayload) => void>;
    const testPayload: TestPayload = { key: 'value' };
    let testObject: Action<TestPayload>;

    beforeEach(() => {
        listenerMock = Mock.ofInstance(payload => {});
        testObject = new Action<TestPayload>();
    });

    test('addListener, invoke', () => {
        listenerMock.setup(l => l(testPayload)).verifiable(Times.once());

        testObject.addListener(listenerMock.object);

        testObject.invoke(testPayload);

        listenerMock.verifyAll();
    });
});

interface TestPayload {
    key: string;
}
