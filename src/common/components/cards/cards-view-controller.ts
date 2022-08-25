// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { CardsViewActions } from 'common/components/cards/cards-view-actions';

export class CardsViewController {
    public constructor(private readonly cardsViewActions: CardsViewActions) {}

    public readonly openIssueFilingSettingsDialog = (): void => {
        this.cardsViewActions.openIssueFilingSettingsDialog.invoke(null);
    };

    public readonly closeIssueFilingSettingsDialog = (): void => {
        this.cardsViewActions.closeIssueFilingSettingsDialog.invoke(null);
    };
}
