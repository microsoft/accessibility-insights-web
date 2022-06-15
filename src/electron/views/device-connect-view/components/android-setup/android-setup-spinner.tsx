// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Spinner, SpinnerSize } from '@fluentui/react';
import { NamedFC } from 'common/react/named-fc';
import * as React from 'react';
import styles from './android-setup-spinner.scss';

export type AndroidSetupSpinnerProps = {
    label: string;
};

export const AndroidSetupSpinner = NamedFC<AndroidSetupSpinnerProps>(
    'AndroidSetupSpinner',
    props => {
        return (
            <Spinner
                className={styles.spinner}
                label={props.label}
                role="alert"
                ariaLive="polite"
                size={SpinnerSize.large}
            />
        );
    },
);
