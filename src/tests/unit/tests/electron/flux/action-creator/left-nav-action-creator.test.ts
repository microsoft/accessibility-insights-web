// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { Action } from 'common/flux/action';
import { LeftNavActionCreator } from 'electron/flux/action-creator/left-nav-action-creator';
import { LeftNavActions } from 'electron/flux/action/left-nav-actions';
import { LeftNavItemKey } from 'electron/types/left-nav-item-key';
import { IMock, Mock } from 'typemoq';

describe('LeftNavActionCreator', () => {
    let actionsMock: IMock<LeftNavActions>;
    let itemSelectedMock: IMock<Action<LeftNavItemKey>>;

    let actionCreator: LeftNavActionCreator;

    beforeEach(() => {
        actionsMock = Mock.ofType<LeftNavActions>();
        itemSelectedMock = Mock.ofType<Action<LeftNavItemKey>>();

        actionsMock.setup(actions => actions.itemSelected).returns(() => itemSelectedMock.object);
        actionCreator = new LeftNavActionCreator(actionsMock.object);
    });

    it('itemSelected', () => {
        const expectedKey: LeftNavItemKey = 'needs-review';

        itemSelectedMock.setup(m => m.invoke(expectedKey)).verifiable();

        actionCreator.itemSelected(expectedKey);

        itemSelectedMock.verifyAll();
    });
});
