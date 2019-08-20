// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shell } from 'electron';
import * as React from 'react';
import { NamedSFC } from '../../../common/react/named-sfc';
import { ElectronExternalLink } from './electron-external-link';

export const DeviceConnectHeader = NamedSFC('DeviceConnectHeader', () => {
    return (
        <header className="device-connect-header">
            <h2>Connect to your android device</h2>
            <ElectronExternalLink
                href="https://go.microsoft.com/fwlink/?linkid=2101252"
                text="How do I connect to my device?"
                shell={shell}
            />
        </header>
    );
});
