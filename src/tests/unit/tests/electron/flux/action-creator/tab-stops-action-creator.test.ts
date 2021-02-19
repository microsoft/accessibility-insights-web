// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Action } from 'common/flux/action';
import { TabStopsActionCreator } from 'electron/flux/action/tab-stops-action-creator';
import { TabStopsActions } from 'electron/flux/action/tab-stops-actions';
import { IMock, Mock, Times } from 'typemoq';

describe('TabStopsActionCreator', () => {
    let tabStopsActionsMock: IMock<TabStopsActions>;
    let testSubject: TabStopsActionCreator;
    let actionMock: IMock<Action<void>>;

    beforeEach(() => {
        tabStopsActionsMock = Mock.ofType<TabStopsActions>();
        actionMock = Mock.ofType<Action<void>>();

        testSubject = new TabStopsActionCreator(tabStopsActionsMock.object);
    });

    it('enableTabStops', () => {
        tabStopsActionsMock.setup(m => m.enableFocusTracking).returns(() => actionMock.object);

        testSubject.enableTabStops();

        actionMock.verify(m => m.invoke(), Times.once());
    });

    it('disableTabStops', () => {
        tabStopsActionsMock.setup(m => m.disableFocusTracking).returns(() => actionMock.object);

        testSubject.disableTabStops();

        actionMock.verify(m => m.invoke(), Times.once());
    });

    it('startOver', () => {
        tabStopsActionsMock.setup(m => m.startOver).returns(() => actionMock.object);

        testSubject.startOver();

        actionMock.verify(m => m.invoke(), Times.once());
    });
});
