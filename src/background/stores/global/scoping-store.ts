// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IndexedDBDataKeys } from 'background/IndexedDBDataKeys';
import { PersistentStore } from 'common/flux/persistent-store';
import { IndexedDBAPI } from 'common/indexedDB/indexedDB';
import { Logger } from 'common/logging/logger';
import { ScopingInputTypes } from 'common/types/store-data/scoping-input-types';
import * as _ from 'lodash/index';

import { StoreNames } from '../../../common/stores/store-names';
import { ScopingStoreData } from '../../../common/types/store-data/scoping-store-data';
import { ScopingActions, ScopingPayload } from './../../actions/scoping-actions';

export class ScopingStore extends PersistentStore<ScopingStoreData> {
    private scopingActions: ScopingActions;

    constructor(
        scopingActions: ScopingActions,
        persistedState: ScopingStoreData,
        idbInstance: IndexedDBAPI,
        logger: Logger,
    ) {
        super(
            StoreNames.ScopingPanelStateStore,
            persistedState,
            idbInstance,
            IndexedDBDataKeys.scopingStore,
            logger,
        );

        this.scopingActions = scopingActions;
    }

    public getDefaultState(): ScopingStoreData {
        const defaultValues: ScopingStoreData = {
            selectors: {
                include: [],
                exclude: [],
            },
        };

        Object.keys(ScopingInputTypes).forEach(inputType => {
            defaultValues.selectors[inputType] = [];
        });

        return defaultValues;
    }

    protected addActionListeners(): void {
        this.scopingActions.getCurrentState.addListener(this.onGetCurrentState);
        this.scopingActions.addSelector.addListener(this.onAddSelector);
        this.scopingActions.deleteSelector.addListener(this.onDeleteSelector);
    }

    private onAddSelector = async (payload: ScopingPayload): Promise<void> => {
        let shouldUpdate: boolean = true;
        _.forEach(Object.keys(this.state.selectors[payload.inputType]), key => {
            if (_.isEqual(this.state.selectors[payload.inputType][key], payload.selector)) {
                shouldUpdate = false;
                return;
            }
        });
        if (shouldUpdate) {
            this.state.selectors[payload.inputType].push(payload.selector);
            await this.emitChanged();
        }
    };

    private onDeleteSelector = async (payload: ScopingPayload): Promise<void> => {
        const promises = Object.keys(this.state.selectors[payload.inputType]).map(async key => {
            if (_.isEqual(this.state.selectors[payload.inputType][key], payload.selector)) {
                this.state.selectors[payload.inputType].splice(key, 1);
                await this.emitChanged();
            }
        });
        await Promise.all(promises);
    };
}
