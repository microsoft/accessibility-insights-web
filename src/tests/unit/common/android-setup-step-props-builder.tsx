// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { UserConfigurationStoreData } from 'common/types/store-data/user-configuration-store';
import { AndroidSetupStepId } from 'electron/platform/android/setup/android-setup-step-id';
import {
    AndroidSetupPageDeps,
    CommonAndroidSetupStepProps,
} from 'electron/views/device-connect-view/components/android-setup/android-setup-types';
import * as React from 'react';
import { BaseDataBuilder } from './base-data-builder';

export class AndroidSetupStepPropsBuilder extends BaseDataBuilder<CommonAndroidSetupStepProps> {
    constructor(stepId: AndroidSetupStepId) {
        super();
        this.data = {
            userConfigurationStoreData: {
                adbLocation: undefined,
            } as UserConfigurationStoreData,
            androidSetupStoreData: {
                currentStepId: stepId,
            },
            deps: {
                LinkComponent: props => <a {...props} />,
                androidSetupActionCreator: null,
                androidSetupStepComponentProvider: null,
                closeApp: null,
                startTesting: null,
                showOpenFileDialog: null,
            },
        };
    }

    public withDep<P extends keyof AndroidSetupPageDeps>(
        property: P,
        value: AndroidSetupPageDeps[P],
    ): this {
        this.data.deps[property] = value;
        return this;
    }
}
