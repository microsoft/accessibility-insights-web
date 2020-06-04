// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AndroidSetupActions } from 'electron/flux/action/android-setup-actions';
import { AndroidSetupStore } from 'electron/flux/store/android-setup-store';
import { AndroidSetupStoreData } from 'electron/flux/types/android-setup-store-data';
import { createStoreWithNullParams, StoreTester } from '../../../../common/store-tester';

describe('AndroidSetupStore', () => {
    let initialState: AndroidSetupStoreData;

    beforeEach(() => {
        initialState = createStoreWithNullParams(AndroidSetupStore).getDefaultState();
    });

    describe('constructor', () => {
        it('has no side effects', () => {
            const testObject = createStoreWithNullParams(AndroidSetupStore);
            expect(testObject).toBeDefined();
        });
    });

    it('cancel action calls listener', () => {
        createStoreTesterForAndroidSetupActions('cancel').testListenerToBeCalledOnce(
            initialState,
            initialState,
        );
    });

    function createStoreTesterForAndroidSetupActions(
        actionName: keyof AndroidSetupActions,
    ): StoreTester<AndroidSetupStoreData, AndroidSetupActions> {
        const factory = (actions: AndroidSetupActions) => new AndroidSetupStore(actions);
        return new StoreTester(AndroidSetupActions, actionName, factory);
    }
});
