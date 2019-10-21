// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react';
import * as React from 'react';
import { scanningSpinner } from './scanning-spinner.scss';

export type ScanningSpinnerProps = {
    isSpinning: boolean;
    label: string;
    ['aria-live']?: 'assertive' | 'polite' | 'off';
};

export const ScanningSpinner = NamedFC<ScanningSpinnerProps>('ScanningSpinner', props => {
    if (!props.isSpinning) {
        return null;
    }

    return (
        <div role="alert" aria-live={props['aria-live']}>
            <Spinner className={scanningSpinner} size={SpinnerSize.large} label={props.label} />
        </div>
    );
});
