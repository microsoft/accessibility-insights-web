// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react';
import * as React from 'react';
import { scanningSpinner } from './scanning-spinner.scss';

export type ScanningSpinnerProps = {
    isScanning: boolean;
};

export const ScanningSpinner = NamedFC<ScanningSpinnerProps>('ScanningSpinner', ({ isScanning: isVisible }) => {
    if (!isVisible) {
        return null;
    }

    return (
        <div role="alert" aria-live="assertive">
            <Spinner className={scanningSpinner} size={SpinnerSize.large} label="Scanning..." />
        </div>
    );
});
