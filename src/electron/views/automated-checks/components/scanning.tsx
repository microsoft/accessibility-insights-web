// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react';
import * as React from 'react';
import { scanningSpinner } from './scanning.scss';

export const Scanning = NamedFC('Scanning', () => {
    return <Spinner className={scanningSpinner} size={SpinnerSize.large} label="Scanning..." />;
});
