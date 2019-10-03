// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { NamedFC } from '../../../../common/react/named-fc';
import { deviceConnectHeader } from './device-connect-header.scss';
import { ElectronLink } from './electron-link';

export const DeviceConnectHeader = NamedFC('DeviceConnectHeader', () => {
    return (
        <header className={deviceConnectHeader}>
            <h2>Connect to your android device</h2>
            <ElectronLink href="https://go.microsoft.com/fwlink/?linkid=2101252">How do I connect to my device?</ElectronLink>
        </header>
    );
});
