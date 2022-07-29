// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { BaseStoreImpl } from 'background/stores/base-store-impl';
import { StoreNames } from 'common/stores/store-names';
import { CapturedInstanceActionType } from 'common/types/captured-instance-action-type';
import {
    EditExistingFailureInstancePayload,
    TabStopsViewActions,
} from 'DetailsView/components/tab-stops/tab-stops-view-actions';
import { TabStopsViewStoreData } from 'DetailsView/components/tab-stops/tab-stops-view-store-data';
import { TabStopRequirementId } from 'types/tab-stop-requirement-info';

export class TabStopsViewStore extends BaseStoreImpl<TabStopsViewStoreData> {
    public constructor(private tabStopsViewActions: TabStopsViewActions) {
        super(StoreNames.TabStopsViewStore);
    }

    public getDefaultState(): TabStopsViewStoreData {
        const defaultState: TabStopsViewStoreData = {
            failureInstanceState: {
                isPanelOpen: false,
                description: null,
                selectedInstanceId: null,
                selectedRequirementId: null,
                actionType: CapturedInstanceActionType.CREATE,
            },
        };

        return defaultState;
    }

    public addActionListeners(): void {
        this.tabStopsViewActions.createNewFailureInstancePanel.addListener(
            this.onCreateNewFailureInstancePanel,
        );
        this.tabStopsViewActions.editExistingFailureInstance.addListener(
            this.onEditExistingFailureInstance,
        );
        this.tabStopsViewActions.updateDescription.addListener(this.onUpdateDescription);
        this.tabStopsViewActions.dismissPanel.addListener(this.onDismissPanel);
    }

    private onCreateNewFailureInstancePanel = async (
        requirementId: TabStopRequirementId,
    ): Promise<void> => {
        this.state.failureInstanceState = this.getDefaultState().failureInstanceState;
        this.state.failureInstanceState.isPanelOpen = true;
        this.state.failureInstanceState.selectedRequirementId = requirementId;
        this.state.failureInstanceState.actionType = CapturedInstanceActionType.CREATE;
        this.emitChanged();
    };

    private onEditExistingFailureInstance = async (
        payload: EditExistingFailureInstancePayload,
    ): Promise<void> => {
        this.state.failureInstanceState.isPanelOpen = true;
        this.state.failureInstanceState.selectedRequirementId = payload.requirementId;
        this.state.failureInstanceState.selectedInstanceId = payload.instanceId;
        this.state.failureInstanceState.description = payload.description;
        this.state.failureInstanceState.actionType = CapturedInstanceActionType.EDIT;
        this.emitChanged();
    };

    private onDismissPanel = async (): Promise<void> => {
        this.state.failureInstanceState.isPanelOpen = false;
        this.emitChanged();
    };

    private onUpdateDescription = async (description: string): Promise<void> => {
        this.state.failureInstanceState.description = description;
        this.emitChanged();
    };
}
