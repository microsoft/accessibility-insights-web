// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { css, Icon } from '@fluentui/react';
import { NamedFC } from 'common/react/named-fc';
import { DeviceInfo } from 'electron/platform/android/adb-wrapper';
import * as React from 'react';
import styles from './device-description.scss';

export interface DeviceDescriptionProps {
    deviceInfo?: DeviceInfo;
    className?: string;
    currentApplication?: string;
}

export const deviceDescriptionAutomationId = 'device-description';
export const DeviceDescription = NamedFC<DeviceDescriptionProps>('DeviceDescription', props => {
    if (props.deviceInfo == null) {
        return null;
    }

    const { isEmulator, friendlyName } = props.deviceInfo;
    const iconName: string = isEmulator ? 'Devices3' : 'CellPhone';
    const iconAriaLabel: string = isEmulator ? 'Emulator' : 'Device';

    let descriptionAndApp;

    if (props.currentApplication) {
        descriptionAndApp = (
            <div className={styles.deviceAndCurrentApplication}>
                {props.deviceInfo.friendlyName}
                <div className={styles.currentApplication}>{props.currentApplication}</div>
            </div>
        );
    } else {
        descriptionAndApp = friendlyName;
    }

    return (
        <div
            className={css(styles.content, props.className)}
            data-automation-id={deviceDescriptionAutomationId}
        >
            <Icon
                iconName={iconName}
                className={styles.iconContent}
                ariaLabel={iconAriaLabel}
                role="img"
            />
            {descriptionAndApp}
        </div>
    );
});
