// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IndexedDBDataKeys } from 'background/IndexedDBDataKeys';
import { PersistentStore } from 'common/flux/persistent-store';
import { IndexedDBAPI } from 'common/indexedDB/indexedDB';
import { Logger } from 'common/logging/logger';
import { InspectMode } from 'common/types/store-data/inspect-modes';
import { InspectStoreData } from 'common/types/store-data/inspect-store-data';
import { StoreNames } from '../../common/stores/store-names';
import { InspectActions, InspectPayload } from '../actions/inspect-actions';
import { TabActions } from '../actions/tab-actions';

export class InspectStore extends PersistentStore<InspectStoreData> {
    private inspectActions: InspectActions;
    private tabActions: TabActions;

    constructor(
        inspectActions: InspectActions,
        tabActions: TabActions,
        persistedState: InspectStoreData,
        idbInstance: IndexedDBAPI,
        logger: Logger,
        tabId: number,
    ) {
        super(
            StoreNames.InspectStore,
            persistedState,
            idbInstance,
            IndexedDBDataKeys.inspectStore(tabId),
            logger,
        );

        this.inspectActions = inspectActions;
        this.tabActions = tabActions;
    }

    public getDefaultState(): InspectStoreData {
        const defaultValue: InspectStoreData = {
            inspectMode: InspectMode.off,
            hoveredOverSelector: null,
        };

        return defaultValue;
    }

    protected addActionListeners(): void {
        this.inspectActions.getCurrentState.addListener(this.onGetCurrentState);
        this.inspectActions.changeInspectMode.addListener(this.onChangeInspectMode);
        this.inspectActions.setHoveredOverSelector.addListener(this.onSetHoveredOverSelector);
        this.tabActions.existingTabUpdated.addListener(this.onTabChange);
    }

    private onChangeInspectMode = async (payload: InspectPayload): Promise<void> => {
        this.state.inspectMode = payload.inspectMode;
        this.state.hoveredOverSelector = null;
        await this.emitChanged();
    };

    private onSetHoveredOverSelector = async (payload: string[]): Promise<void> => {
        this.state.hoveredOverSelector = payload;
        await this.emitChanged();
    };

    private onTabChange = async (): Promise<void> => {
        this.state = this.getDefaultState();
        await this.emitChanged();
    };
}
