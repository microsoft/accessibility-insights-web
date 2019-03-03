// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IMock, Mock, Times } from 'typemoq';

import { Action } from '../../../../../common/flux/action';

describe('ActionTest', () => {
    let listenerMock: IMock<(payload: ITestPayload) => void>;
    const testPayload: ITestPayload = { key: 'value' };
    let testObject: Action<ITestPayload>;

    beforeEach(() => {
        listenerMock = Mock.ofInstance(payload => {});
        testObject = new Action<ITestPayload>();
    });

    test('addListener, invoke', () => {
        listenerMock.setup(l => l(testPayload)).verifiable(Times.once());

        testObject.addListener(listenerMock.object);

        testObject.invoke(testPayload);

        listenerMock.verifyAll();
    });
});

// tslint:disable-next-line:interface-name
interface ITestPayload {
    key: string;
}
