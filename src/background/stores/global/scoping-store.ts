// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { autobind } from '@uifabric/utilities';
import * as _ from 'lodash/index';

import { StoreNames } from '../../../common/stores/store-names';
import { IScopingStoreData } from '../../../common/types/store-data/scoping-store-data';
import { BaseStore } from '../base-store';
import { ScopingPayload, ScopingActions } from './../../actions/scoping-actions';
import { ScopingInputTypes } from './../../scoping-input-types';

export class ScopingStore extends BaseStore<IScopingStoreData> {
    private scopingActions: ScopingActions;

    constructor(scopingActions: ScopingActions) {
        super(StoreNames.ScopingPanelStateStore);

        this.scopingActions = scopingActions;
    }

    public getDefaultState(): IScopingStoreData {
        const defaultValues: IScopingStoreData = {
            selectors: {},
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

    @autobind
    private onAddSelector(payload: ScopingPayload): void {
        let shouldUpdate: boolean = true;
        _.forEach(Object.keys(this.state.selectors[payload.inputType]), key => {
            if (_.isEqual(this.state.selectors[payload.inputType][key], payload.selector)) {
                shouldUpdate = false;
                return;
            }
        });
        if (shouldUpdate) {
            this.state.selectors[payload.inputType].push(payload.selector);
            this.emitChanged();
        }
    }

    @autobind
    private onDeleteSelector(payload: ScopingPayload): void {
        _.forEach(Object.keys(this.state.selectors[payload.inputType]), key => {
            if (_.isEqual(this.state.selectors[payload.inputType][key], payload.selector)) {
                this.state.selectors[payload.inputType].splice(key, 1);
                this.emitChanged();
            }
        });
    }
}
