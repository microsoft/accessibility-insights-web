// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import { AndroidSetupActionCreator } from 'electron/flux/action-creator/android-setup-action-creator';
import {
    DeviceConnectFooter,
    DeviceConnectFooterDeps,
} from 'electron/views/device-connect-view/components/device-connect-footer';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react';
import * as React from 'react';

import { androidSetupSpinner } from './android-setup.scss';

export type AndroidSetupSpinnerDeps = {
    androidSetupActionCreator: AndroidSetupActionCreator;
} & DeviceConnectFooterDeps;
export type AndroidSetupSpinnerProps = {
    deps: AndroidSetupSpinnerDeps;
    spinnerLabel: string;
};

export const AndroidSetupSpinnerLayout = NamedFC<AndroidSetupSpinnerProps>(
    'AndroidSetupSpinnerLayout',
    (props: AndroidSetupSpinnerProps) => {
        return (
            <>
                <Spinner
                    className={androidSetupSpinner}
                    size={SpinnerSize.large}
                    label={props.spinnerLabel}
                    role="alert"
                    aria-live={props['aria-live']}
                />
                <DeviceConnectFooter
                    deps={props.deps}
                    cancelClick={props.deps.androidSetupActionCreator.cancel}
                    canStartTesting={false}
                ></DeviceConnectFooter>
            </>
        );
    },
);
