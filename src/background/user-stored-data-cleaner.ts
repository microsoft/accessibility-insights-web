// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as _ from 'lodash/index';

import { IChromeAdapter } from './browser-adapter';

export class UserStoredDataCleaner {
    private _browserAdapter: IChromeAdapter;

    constructor(adapter: IChromeAdapter) {
        this._browserAdapter = adapter;
    }

    public cleanUserData(userDataKeys: string[], callback?: () => void): void {
        this._browserAdapter.getUserData(userDataKeys,userDataKeysMap => {
            _.each(userDataKeysMap, (value, key) => {
                this._browserAdapter.removeUserData(key);
            });

            if (callback) {
                callback();
            }
        });
    }
}
