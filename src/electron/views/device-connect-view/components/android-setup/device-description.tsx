// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { NamedFC } from 'common/react/named-fc';
import { DeviceInfo } from 'electron/platform/android/android-service-configurator';
import { css, Icon } from 'office-ui-fabric-react';
import * as React from 'react';
import * as styles from './device-description.scss';

export interface DeviceDescriptionProps extends DeviceInfo {
    className?: string;
    currentApplication?: string;
}

export const DeviceDescription = NamedFC<DeviceDescriptionProps>('DeviceDescription', props => {
    const iconName: string = props.isEmulator ? 'Devices3' : 'CellPhone';
    const iconAriaLabel: string = props.isEmulator ? 'Emulator' : 'Device';

    let descriptionAndApp;

    if (props.currentApplication) {
        descriptionAndApp = (
            <div className={styles.deviceAndCurrentApplication}>
                {props.friendlyName}
                <div className={styles.currentApplication}>{props.currentApplication}</div>
            </div>
        );
    } else {
        descriptionAndApp = props.friendlyName;
    }

    return (
        <div className={css(styles.content, props.className)}>
            <Icon iconName={iconName} className={styles.iconContent} ariaLabel={iconAriaLabel} />
            {descriptionAndApp}
        </div>
    );
});
