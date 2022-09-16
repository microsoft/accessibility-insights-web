// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { BaseStoreImpl } from 'background/stores/base-store-impl';
import {
    CardsViewActions,
    OpenIssueFilingSettingsDialogPayload,
} from 'common/components/cards/cards-view-actions';
import { CardsViewStoreData } from 'common/components/cards/cards-view-store-data';
import { StoreNames } from 'common/stores/store-names';

export class CardsViewStore extends BaseStoreImpl<CardsViewStoreData> {
    public constructor(private readonly cardsViewActions: CardsViewActions) {
        super(StoreNames.CardsViewStore);
    }

    public getDefaultState(): CardsViewStoreData {
        const defaultState: CardsViewStoreData = {
            isIssueFilingSettingsDialogOpen: false,
        };

        return defaultState;
    }

    public addActionListeners(): void {
        this.cardsViewActions.closeIssueFilingSettingsDialog.addListener(
            this.closeIssueFilingSettingsDialog,
        );
        this.cardsViewActions.openIssueFilingSettingsDialog.addListener(
            this.openIssueFilingSettingsDialog,
        );
    }

    private openIssueFilingSettingsDialog = (
        payload: OpenIssueFilingSettingsDialogPayload,
    ): void => {
        this.state.isIssueFilingSettingsDialogOpen = true;
        this.state.onIssueFilingSettingsClosedCallback = payload.onDialogDismissedCallback;
        this.state.selectedIssueData = payload.selectedIssueData;

        this.emitChanged();
    };

    private closeIssueFilingSettingsDialog = (): void => {
        this.state.isIssueFilingSettingsDialogOpen = false;

        this.emitChanged();
    };
}
