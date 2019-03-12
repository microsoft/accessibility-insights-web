// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { autobind } from '@uifabric/utilities';
import { StoreNames } from '../../common/stores/store-names';
import { IInspectStoreData } from '../../common/types/store-data/inspect-store-data';
import { InspectActions, InspectPayload } from '../actions/inspect-actions';
import { TabActions } from '../actions/tab-actions';
import { InspectMode } from '../inspect-modes';
import { BaseStore } from './base-store';

export class InspectStore extends BaseStore<IInspectStoreData> {
    private inspectActions: InspectActions;
    private tabActions: TabActions;

    constructor(inspectActions: InspectActions, tabActions: TabActions) {
        super(StoreNames.InspectStore);

        this.inspectActions = inspectActions;
        this.tabActions = tabActions;
    }

    public getDefaultState(): IInspectStoreData {
        const defaultValue: IInspectStoreData = {
            inspectMode: InspectMode.off,
            hoveredOverSelector: null,
        };

        return defaultValue;
    }

    protected addActionListeners(): void {
        this.inspectActions.getCurrentState.addListener(this.onGetCurrentState);
        this.inspectActions.changeInspectMode.addListener(this.onChangeInspectMode);
        this.inspectActions.setHoveredOverSelector.addListener(this.onSetHoveredOverSelector);
        this.tabActions.tabChange.addListener(this.onTabChange);
    }

    @autobind
    private onChangeInspectMode(payload: InspectPayload): void {
        this.state.inspectMode = payload.inspectMode;
        this.state.hoveredOverSelector = null;
        this.emitChanged();
    }

    @autobind
    private onSetHoveredOverSelector(payload: string[]): void {
        this.state.hoveredOverSelector = payload;
        this.emitChanged();
    }

    @autobind
    private onTabChange(): void {
        this.state = this.getDefaultState();
        this.emitChanged();
    }
}
