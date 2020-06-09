// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { NamedFC } from 'common/react/named-fc';
import { DeviceMetadata } from 'electron/flux/types/device-metadata';
import { Icon } from 'office-ui-fabric-react';
import * as React from 'react';
import * as styles from './device-description.scss';

export interface DeviceDescriptionProps extends DeviceMetadata {}

export const DeviceDescription = NamedFC<DeviceDescriptionProps>('DeviceDescription', props => {
    const iconName: string = props.isEmulator ? 'Devices3' : 'CellPhone';

    return (
        <React.Fragment>
            <div className={styles.content}>
                <Icon iconName={iconName} className={styles.iconContent} />
                {props.description}
            </div>
        </React.Fragment>
    );
});
