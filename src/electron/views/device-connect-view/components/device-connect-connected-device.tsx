// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
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
        const renderContents = (): JSX.Element => {
            if (props.deviceConnectState === DeviceConnectState.Connecting) {
                return (
                    <Spinner
                        className={styles.deviceConnectSpinner}
                        labelPosition="right"
                        size={SpinnerSize.xSmall}
                        label="Connecting to mobile device"
                    />
                );
            }

            if (props.deviceConnectState === DeviceConnectState.Error) {
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

            if (props.deviceConnectState === DeviceConnectState.Default) {
                return null;
            }

            if (props.connectedDevice) {
                return <span className={styles.scannedText}>{props.connectedDevice}</span>;
            }
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
