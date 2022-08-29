// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { SyncAction } from 'common/flux/sync-action';
import { TabStopsTestViewController } from 'DetailsView/components/tab-stops/tab-stops-test-view-controller';
import {
    EditExistingFailureInstancePayload,
    TabStopsViewActions,
} from 'DetailsView/components/tab-stops/tab-stops-view-actions';
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';

describe('TabStopsTestViewController', () => {
    let testSubject: TabStopsTestViewController;
    let tabStopActionsMock: IMock<TabStopsViewActions>;

    test('createNewFailureInstancePanel', async () => {
        const payload = 'some string';
        tabStopActionsMock = createActionsMock('createNewFailureInstancePanel');
        testSubject = new TabStopsTestViewController(tabStopActionsMock.object);

        await testSubject.createNewFailureInstancePanel(payload);

        tabStopActionsMock.verify(
            m => m.createNewFailureInstancePanel.invoke(payload),
            Times.once(),
        );
    });

    test('updateDescription', async () => {
        const payload = 'some string';
        tabStopActionsMock = createActionsMock('updateDescription');
        testSubject = new TabStopsTestViewController(tabStopActionsMock.object);

        await testSubject.updateDescription(payload);

        tabStopActionsMock.verify(m => m.updateDescription.invoke(payload), Times.once());
    });

    test('dismissPanel', async () => {
        tabStopActionsMock = createActionsMock('dismissPanel');
        testSubject = new TabStopsTestViewController(tabStopActionsMock.object);

        await testSubject.dismissPanel();

        tabStopActionsMock.verify(m => m.dismissPanel.invoke(), Times.once());
    });

    test('editExistingFailureInstance', async () => {
        const payload = {} as EditExistingFailureInstancePayload;
        tabStopActionsMock = createActionsMock('editExistingFailureInstance');
        testSubject = new TabStopsTestViewController(tabStopActionsMock.object);

        await testSubject.editExistingFailureInstance(payload);

        tabStopActionsMock.verify(m => m.editExistingFailureInstance.invoke(payload), Times.once());
    });

    function createActionsMock(actionName: keyof TabStopsViewActions): IMock<TabStopsViewActions> {
        const actionMock = createActionMock();

        const actionsMock = Mock.ofType(TabStopsViewActions, MockBehavior.Loose);
        actionsMock.setup(a => a[actionName as string]).returns(() => actionMock.object);

        return actionsMock;
    }

    function createActionMock(): IMock<SyncAction<unknown>> {
        const actionMock = Mock.ofType(SyncAction);

        actionMock
            .setup(a => a.addListener(It.is(param => param instanceof Function)))
            .callback(listener => (this.listener = listener));

        return actionMock;
    }
});
