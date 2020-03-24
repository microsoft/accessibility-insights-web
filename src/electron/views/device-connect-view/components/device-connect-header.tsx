// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import { LinkComponentType } from 'common/types/link-component-type';
import * as React from 'react';
import * as styles from './device-connect-header.scss';

export type DeviceConnectHeaderDeps = {
    LinkComponent: LinkComponentType;
};

export type DeviceConnectHeaderProps = {
    deps: DeviceConnectHeaderDeps;
};

export const DeviceConnectHeader = NamedFC<DeviceConnectHeaderProps>(
    'DeviceConnectHeader',
    ({ deps }) => {
        const { LinkComponent } = deps;
        return (
            <header className={styles.deviceConnectHeader}>
                <h1>Connect to your Android device</h1>
                <LinkComponent href="https://go.microsoft.com/fwlink/?linkid=2101252">
                    How do I connect to my device?
                </LinkComponent>
            </header>
        );
    },
);
