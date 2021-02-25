// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { InjectedDialogActions } from 'background/actions/injected-dialog-actions';
import { VisualizationActions } from 'background/actions/visualization-actions';
import { StoreNames } from 'common/stores/store-names';
import { InjectedDialogStoreData } from 'common/types/store-data/injected-dialog-store-data';
import { InjectedDialogOpenPayload } from '../actions/action-payloads';
import { BaseStoreImpl } from './base-store-impl';

export class InjectedDialogStore extends BaseStoreImpl<InjectedDialogStoreData> {
    constructor(
        private readonly injectedDialogActions: InjectedDialogActions,
        private readonly visualizationActions: VisualizationActions,
    ) {
        super(StoreNames.InjectedDialogStore);
    }

    protected addActionListeners(): void {
        this.injectedDialogActions.getCurrentState.addListener(this.onGetCurrentState);
        this.injectedDialogActions.openDialog.addListener(this.onOpenDialog);
        this.injectedDialogActions.closeDialog.addListener(this.onCloseDialog);

        this.visualizationActions.enableVisualization.addListener(this.onCloseDialog);
        this.visualizationActions.disableVisualization.addListener(this.onCloseDialog);
        this.visualizationActions.updateSelectedPivot.addListener(this.onCloseDialog);
        this.visualizationActions.updateSelectedPivotChild.addListener(this.onCloseDialog);
    }

    public getDefaultState(): InjectedDialogStoreData {
        return {
            isOpen: false,
            target: null,
        };
    }

    private onOpenDialog = (payload: InjectedDialogOpenPayload): void => {
        this.state = {
            isOpen: true,
            target: payload.target,
        };
        this.emitChanged();
    };

    private onCloseDialog = (): void => {
        if (this.state.isOpen) {
            this.state = {
                isOpen: false,
                target: null,
            };
            this.emitChanged();
        }
    };
}
