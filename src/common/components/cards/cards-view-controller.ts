// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { CardsViewActions } from 'common/components/cards/cards-view-actions';

export class CardsViewController {
    public constructor(private readonly cardsViewActions: CardsViewActions) {}

    public openIssueFilingSettingsDialog(): void {
        this.cardsViewActions.openIssueFilingSettingsDialog.invoke(null);
    }

    public closeIssueFilingSettingsDialog(): void {
        this.cardsViewActions.closeIssueFilingSettingsDialog.invoke(null);
    }
}
