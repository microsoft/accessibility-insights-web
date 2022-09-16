// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import {
    CardsViewActions,
    OpenIssueFilingSettingsDialogPayload,
} from 'common/components/cards/cards-view-actions';
import { CardsViewController } from 'common/components/cards/cards-view-controller';
import { CreateIssueDetailsTextData } from 'common/types/create-issue-details-text-data';
import { createSyncActionMock } from 'tests/unit/tests/background/global-action-creators/action-creator-test-helpers';
import { IMock, Mock } from 'typemoq';

describe(CardsViewController, () => {
    let cardsViewActionsMock: IMock<CardsViewActions>;

    let testSubject: CardsViewController;

    beforeEach(() => {
        cardsViewActionsMock = Mock.ofType<CardsViewActions>();

        testSubject = new CardsViewController(cardsViewActionsMock.object);
    });

    afterEach(() => {
        cardsViewActionsMock.verifyAll();
    });

    it('openIssueFilingSettingsDialog', () => {
        const callback = () => null;
        const issueDetails = {
            snippet: 'test snippet',
        } as CreateIssueDetailsTextData;
        const expectedPayload: OpenIssueFilingSettingsDialogPayload = {
            onDialogDismissedCallback: callback,
            selectedIssueData: issueDetails,
        };
        const actionMock = createSyncActionMock(expectedPayload);

        cardsViewActionsMock
            .setup(c => c.openIssueFilingSettingsDialog)
            .returns(() => actionMock.object);

        testSubject.openIssueFilingSettingsDialog(issueDetails, callback);

        actionMock.verifyAll();
    });

    it('closeIssueFilingSettingsDialog', () => {
        const actionMock = createSyncActionMock(null);
        cardsViewActionsMock
            .setup(c => c.closeIssueFilingSettingsDialog)
            .returns(() => actionMock.object);

        testSubject.closeIssueFilingSettingsDialog();

        actionMock.verifyAll();
    });
});
