// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { assertNever } from 'common/components/assert-never';
import { NamedFC } from 'common/react/named-fc';
import { Icon, Spinner, SpinnerSize } from 'office-ui-fabric-react';
import * as React from 'react';
import { DeviceConnectState } from '../../../flux/types/device-connect-state';
import * as styles from './device-connect-connected-device.scss';

export interface DeviceConnectConnectedDeviceProps {
    deviceConnectState: DeviceConnectState;
    connectedDevice?: string;
}

export const DeviceConnectConnectedDevice = NamedFC<DeviceConnectConnectedDeviceProps>(
    'DeviceConnectConnectedDevice',
    (props: DeviceConnectConnectedDeviceProps) => {
        const renderContents = (): JSX.Element | null => {
            switch (props.deviceConnectState) {
                case DeviceConnectState.Error: {
                    return (
                        <>
                            <Icon
                                iconName="statusErrorFull"
                                className={styles.connectionErrorIcon}
                                ariaLabel="Connection failed"
                            ></Icon>
                            <span className={styles.scannedText}>
                                No active applications were found at the provided local host.
                            </span>
                        </>
                    );
                }
                case DeviceConnectState.Connecting: {
                    return (
                        <Spinner
                            className={styles.deviceConnectSpinner}
                            labelPosition="right"
                            size={SpinnerSize.xSmall}
                            label="Connecting to mobile device"
                        />
                    );
                }
                case DeviceConnectState.Connected: {
                    return props.connectedDevice ? (
                        <span className={styles.scannedText}>{props.connectedDevice}</span>
                    ) : null;
                }
                case DeviceConnectState.Default: {
                    return null;
                }
                default: {
                    return assertNever(props.deviceConnectState);
                }
            } // switch
        };

        return (
            <div className={styles.deviceConnectConnectedDevice}>
                <div className={styles.label}>Connected device</div>
                <div role="alert" aria-live="assertive">
                    {renderContents()}
                </div>
            </div>
        );
    },
);
