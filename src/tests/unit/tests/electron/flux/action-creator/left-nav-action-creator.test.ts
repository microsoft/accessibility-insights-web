// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { Action } from 'common/flux/action';
import { LeftNavActionCreator } from 'electron/flux/action-creator/left-nav-action-creator';
import { LeftNavActions } from 'electron/flux/action/left-nav-actions';
import { LeftNavItemKey } from 'electron/types/left-nav-item-key';
import { IMock, Mock, MockBehavior } from 'typemoq';

describe('LeftNavActionCreator', () => {
    let actionsMock: IMock<LeftNavActions>;
    let actionCreator: LeftNavActionCreator;

    beforeEach(() => {
        actionsMock = Mock.ofType<LeftNavActions>(undefined, MockBehavior.Strict);
        actionCreator = new LeftNavActionCreator(actionsMock.object);
    });

    it('itemSelected', () => {
        const itemSelectedMock = Mock.ofType<Action<LeftNavItemKey>>();
        actionsMock
            .setup(actions => actions.itemSelected)
            .returns(() => itemSelectedMock.object)
            .verifiable();

        const expectedKey: LeftNavItemKey = 'needs-review';

        itemSelectedMock.setup(m => m.invoke(expectedKey)).verifiable();

        actionCreator.itemSelected(expectedKey);

        itemSelectedMock.verifyAll();
        actionsMock.verifyAll();
    });

    it.each([[true], [false]])('setLeftNavVisible', testValue => {
        const setLeftNavVisibleMock = Mock.ofType<Action<boolean>>();
        actionsMock
            .setup(actions => actions.setLeftNavVisible)
            .returns(() => setLeftNavVisibleMock.object)
            .verifiable();

        setLeftNavVisibleMock.setup(m => m.invoke(testValue)).verifiable();

        actionCreator.setLeftNavVisible(testValue);

        setLeftNavVisibleMock.verifyAll();
        actionsMock.verifyAll();
    });
});
