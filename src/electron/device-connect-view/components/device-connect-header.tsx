// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shell } from 'electron';
import * as React from 'react';
import { NamedFC } from '../../../common/react/named-fc';
import { ElectronExternalLink } from './electron-external-link';

export const DeviceConnectHeader = NamedFC('DeviceConnectHeader', () => {
    return (
        <header className="device-connect-header">
            <h2>Connect to your android device</h2>
            <ElectronExternalLink href="https://go.microsoft.com/fwlink/?linkid=2101252" shell={shell}>
                How do I connect to my device?
            </ElectronExternalLink>
        </header>
    );
});
