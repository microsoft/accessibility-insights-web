// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { Dialog, DialogFooter, DialogType } from 'office-ui-fabric-react/lib/Dialog';
import * as React from 'react';

import { deviceDisconnectedPopup, titleContainer, titleText } from './device-disconnected-popup.scss';
import { StatusCautionIcon } from './status-caution-icon';

export type DeviceDisconnectedPopupProps = {
    onConnectNewDevice: () => void;
    onRescanDevice: () => void;
    deviceName: string;
};

export const DeviceDisconnectedPopup = NamedFC<DeviceDisconnectedPopupProps>(
    'DeviceDisconnectedPopup',
    ({ deviceName, onConnectNewDevice, onRescanDevice }) => {
        const title: JSX.Element = (
            <div className={titleContainer}>
                <StatusCautionIcon />
                <span className={titleText}>Device disconnected</span>
            </div>
        );

        return (
            <Dialog
                dialogContentProps={{
                    type: DialogType.normal,
                    showCloseButton: false,
                    title,
                }}
                modalProps={{
                    isBlocking: true,
                    className: deviceDisconnectedPopup,
                }}
                hidden={false}
                minWidth={416}
            >
                <div>
                    <p>Uh-oh! It seems the {deviceName} device has disconnected before the snapshot completed its analysis.</p>
                    <p>Make sure your device is properly connected, and try rescanning or connecting a different device.</p>
                </div>
                <DialogFooter>
                    <DefaultButton text="Connect a new device" onClick={onConnectNewDevice} />
                    <DefaultButton text="Rescan device" onClick={onRescanDevice} />
                </DialogFooter>
            </Dialog>
        );
    },
);
