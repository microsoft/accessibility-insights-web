// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { CardsViewActions } from 'common/components/cards/cards-view-actions';
import { CreateIssueDetailsTextData } from 'common/types/create-issue-details-text-data';

export class CardsViewController {
    public constructor(private readonly cardsViewActions: CardsViewActions) {}

    public readonly openIssueFilingSettingsDialog = (
        selectedIssueData: CreateIssueDetailsTextData,
        onDialogDismissedCallback?: () => void,
    ): void => {
        this.cardsViewActions.openIssueFilingSettingsDialog.invoke({
            selectedIssueData,
            onDialogDismissedCallback,
        });
    };

    public readonly closeIssueFilingSettingsDialog = (): void => {
        this.cardsViewActions.closeIssueFilingSettingsDialog.invoke(null);
    };
}
