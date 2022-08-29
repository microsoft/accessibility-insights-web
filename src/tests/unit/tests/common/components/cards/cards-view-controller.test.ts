// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { CardsViewActions } from 'common/components/cards/cards-view-actions';
import { CardsViewController } from 'common/components/cards/cards-view-controller';
import { SyncAction } from 'common/flux/sync-action';
import { createSyncActionMock } from 'tests/unit/tests/background/global-action-creators/action-creator-test-helpers';
import { IMock, Mock } from 'typemoq';

describe(CardsViewController, () => {
    let cardsViewActionsMock: IMock<CardsViewActions>;
    let actionMock: IMock<SyncAction<unknown>>;

    let testSubject: CardsViewController;

    beforeEach(() => {
        cardsViewActionsMock = Mock.ofType<CardsViewActions>();
        actionMock = createSyncActionMock(null);

        testSubject = new CardsViewController(cardsViewActionsMock.object);
    });

    afterEach(() => {
        cardsViewActionsMock.verifyAll();
        actionMock.verifyAll();
    });

    it('openIssueFilingSettingsDialog', () => {
        cardsViewActionsMock
            .setup(c => c.openIssueFilingSettingsDialog)
            .returns(() => actionMock.object);

        testSubject.openIssueFilingSettingsDialog();
    });

    it('closeIssueFilingSettingsDialog', () => {
        cardsViewActionsMock
            .setup(c => c.closeIssueFilingSettingsDialog)
            .returns(() => actionMock.object);

        testSubject.closeIssueFilingSettingsDialog();
    });
});
