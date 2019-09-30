// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as _ from 'lodash/index';

import { StoreNames } from '../../../common/stores/store-names';
import { ScopingStoreData } from '../../../common/types/store-data/scoping-store-data';
import { BaseStoreImpl } from '../base-store-impl';
import { ScopingActions, ScopingPayload } from './../../actions/scoping-actions';
import { ScopingInputTypes } from './../../scoping-input-types';

export class ScopingStore extends BaseStoreImpl<ScopingStoreData> {
    private scopingActions: ScopingActions;

    constructor(scopingActions: ScopingActions) {
        super(StoreNames.ScopingPanelStateStore);

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

    private onAddSelector = (payload: ScopingPayload): void => {
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
    };

    private onDeleteSelector = (payload: ScopingPayload): void => {
        _.forEach(Object.keys(this.state.selectors[payload.inputType]), key => {
            if (_.isEqual(this.state.selectors[payload.inputType][key], payload.selector)) {
                this.state.selectors[payload.inputType].splice(key, 1);
                this.emitChanged();
            }
        });
    };
}
