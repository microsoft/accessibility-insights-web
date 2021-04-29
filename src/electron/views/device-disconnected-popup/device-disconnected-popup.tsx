// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import { DefaultButton } from 'office-ui-fabric-react';
import { Dialog, DialogFooter, DialogType } from 'office-ui-fabric-react';
import * as React from 'react';

import * as styles from './device-disconnected-popup.scss';
import { StatusCautionIcon } from './status-caution-icon';

export type DeviceDisconnectedPopupProps = {
    onRedetectDevice: () => void;
    deviceName: string;
};

export const DeviceDisconnectedPopup = NamedFC<DeviceDisconnectedPopupProps>(
    'DeviceDisconnectedPopup',
    ({ deviceName, onRedetectDevice }) => {
        const title: JSX.Element = (
            <div className={styles.titleContainer}>
                <StatusCautionIcon />
                <span className={styles.titleText}>Device disconnected</span>
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
                    className: styles.deviceDisconnectedPopup,
                }}
                hidden={false}
                minWidth={416}
            >
                <div>
                    <p>
                        Uh-oh! It seems the device <strong>{deviceName}</strong> has disconnected.
                    </p>
                    <p>
                        Select <strong>Re-detect device</strong> to continue.
                    </p>
                </div>
                <DialogFooter>
                    <DefaultButton text="Re-detect device" onClick={onRedetectDevice} />
                </DialogFooter>
            </Dialog>
        );
    },
);
